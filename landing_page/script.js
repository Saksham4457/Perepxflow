// Theme Toggle Logic
const initTheme = () => {
    const theme = localStorage.getItem('prepxflow_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
};

const toggleTheme = () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('prepxflow_theme', next);
    updateThemeIcon(next);
    
    // Update 3D Background if it exists
    if (typeof threeApp !== 'undefined' && threeApp) {
        threeApp.updateTheme(next);
    }
};

const updateThemeIcon = (theme) => {
    const icon = document.getElementById('theme-icon-landing');
    if (!icon) return;
    icon.setAttribute('data-lucide', theme === 'dark' ? 'moon' : 'sun');
    lucide.createIcons();
};

const themeToggleBtn = document.getElementById('theme-toggle-landing');
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
}

initTheme();

// Initialize Lucide icons
lucide.createIcons();

// Sticky Navbar Logic
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Reveal Animation on Scroll
const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            el.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
// Trigger once on load
revealOnScroll();

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Hero Background Parallax Effect
window.addEventListener('scroll', () => {
    const heroBg = document.querySelector('.hero-bg img');
    const scrollValue = window.scrollY;
    if (heroBg) {
        heroBg.style.transform = `translateY(${scrollValue * 0.4}px)`;
    }
});

// Waitlist Form Handling
const waitlistCountEl = document.getElementById('waitlist-count');
let storedCount = localStorage.getItem('prepxflow_waitlist_real_count');
let currentCount = storedCount !== null ? parseInt(storedCount) : 0;

if (waitlistCountEl) {
    waitlistCountEl.textContent = currentCount.toLocaleString();
}

document.querySelectorAll('.waitlist-form').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input');
        const button = form.querySelector('button');
        const email = input.value;
        
        if (email) {
            // Visual feedback for submission
            const originalText = button.textContent;
            button.textContent = "You're in. Stay ready.";
            button.disabled = true;
            button.classList.remove('btn-pulse');
            button.style.background = "#00ff88"; // Success green
            button.style.color = "#05070a";
            input.value = "";
            input.disabled = true;
            
            // Save the email to local storage for the developer to see
            let savedEmails = JSON.parse(localStorage.getItem('prepxflow_waitlist_emails')) || [];
            savedEmails.push(email);
            localStorage.setItem('prepxflow_waitlist_emails', JSON.stringify(savedEmails));
            
            console.log(`✅ New Signup: ${email}`);
            console.log(`Total Emails Collected:`, savedEmails);
            
            // Increment count on local successful join
            if (waitlistCountEl) {
                currentCount++;
                waitlistCountEl.textContent = currentCount.toLocaleString();
                localStorage.setItem('prepxflow_waitlist_real_count', currentCount);
            }
        }
    });
});

