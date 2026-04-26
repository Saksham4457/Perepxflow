/**
 * Prepxflow App Logic
 */

const app = {
    user: null,
    currentView: 'dashboard',
    timerInterval: null,
    selectedDuration: 50,
    
    init() {
        this.user = Store.getUser();
        this.initTheme();
        if (!this.user) {
            this.renderOnboarding();
        } else {
            window.location.href = '../dashboard/dashboard.html';
        }
        lucide.createIcons();
    },
    
    initTheme() {
        const theme = localStorage.getItem('prepxflow_theme') || 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        this.updateThemeIcon(theme);
    },

    toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('prepxflow_theme', next);
        this.updateThemeIcon(next);
    },

    updateThemeIcon(theme) {
        const icon = document.getElementById('theme-icon');
        if (!icon) return;
        icon.setAttribute('data-lucide', theme === 'dark' ? 'moon' : 'sun');
        lucide.createIcons();
    },

    toggleSidebar() {
        document.getElementById('app').classList.toggle('sidebar-collapsed');
    },
    
    showSidebar() {
        document.getElementById('sidebar').classList.remove('hidden');
        document.getElementById('user-name-display').textContent = this.user.name;
        document.getElementById('user-level-display').textContent = `Lvl ${Math.floor(this.user.stats.consistency / 10)}`;
    },
    
    navigate(view) {
        this.currentView = view;
        const main = document.getElementById('main-view');
        
        // Update nav active state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.onclick && item.onclick.toString().includes(view)) item.classList.add('active');
        });
        
        switch(view) {
            case 'dashboard': this.renderDashboard(main); break;
            case 'buddy': this.renderBuddy(main); break;
            case 'challenges': this.renderChallenges(main); break;
            case 'community': this.renderCommunity(main); break;
            case 'analytics': this.renderAnalytics(main); break;
            case 'problems': this.renderProblems(main); break;
            case 'profile': this.renderProfile(main); break;
            case 'ai-selection': this.renderAISelection(main); break;
        }
        lucide.createIcons();
    },
    
    renderAISelection(el) {
        const partners = Store.getAIPartners();
        el.innerHTML = `
            <div class="max-w-5xl mx-auto py-12 animate-fade-in">
                <div class="text-center mb-16">
                    <h1 class="text-4xl font-bold mb-4">Choose Your <span class="gradient-text">AI Accountability Partner</span></h1>
                    <p class="text-slate-400">This partner will enforce your schedule, guide your flow, and ensure execution.</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    ${partners.map(p => `
                        <div class="card glass-panel group hover:border-[${p.color}]/50 transition-all duration-500 cursor-pointer flex flex-col items-center text-center p-8 rounded-[2rem]" onclick="app.selectAIPartner('${p.id}')">
                            <div class="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg" style="background: ${p.color}20; color: ${p.color}; shadow-color: ${p.color}40">
                                <i data-lucide="${p.avatar}" class="w-8 h-8"></i>
                            </div>
                            <h3 class="text-xl font-bold mb-2">${p.name}</h3>
                            <span class="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">${p.role}</span>
                            <p class="text-sm text-slate-400 leading-relaxed">${p.desc}</p>
                            <button class="mt-8 px-6 py-2 rounded-full text-xs font-bold border border-white/10 group-hover:bg-white group-hover:text-black transition-all">Select Partner</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    selectAIPartner(id) {
        const partner = Store.getAIPartners().find(p => p.id === id);
        this.aiPartner = partner;
        this.user.aiPartner = partner;
        Store.saveUser(this.user);
        this.navigate('dashboard');
    },
    
    // --- Renderers ---
    
    renderOnboarding() {
        const main = document.getElementById('main-view');
        // Ensure the app layout doesn't interfere
        document.getElementById('app').classList.add('sidebar-collapsed');
        
        main.innerHTML = `
            <div class="fixed inset-0 z-[3000] bg-[#020617] flex flex-col md:flex-row overflow-hidden font-['Outfit']">
                <!-- Left Side: Branding & Hero -->
                <div class="w-full md:w-[40%] p-12 flex flex-col justify-center relative overflow-hidden bg-black">
                    <!-- Dynamic Background Elements -->
                    <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
                    <div class="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse" style="animation-delay: 1.5s;"></div>
                    
                    <div class="relative z-10 animate-fade-in">
                        <div class="flex items-center gap-3 mb-12">
                            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00f2ff] to-[#7000ff] flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <i data-lucide="zap" class="text-white w-6 h-6"></i>
                            </div>
                            <div class="text-2xl font-extrabold tracking-tight">
                                PREPX<span class="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ff] to-[#7000ff]">FLOW</span>
                            </div>
                        </div>
                        
                        <h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
                            Create Your <br>
                            <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ff] to-[#7000ff]">Discipline Profile</span>
                        </h1>
                        <p class="text-slate-400 text-xl max-w-md font-light leading-relaxed">
                            The bridge between goals and accomplishment is <span class="text-white font-medium">discipline</span>. Start your high-performance journey today.
                        </p>
                        
                        <div class="mt-12 flex items-center gap-4 text-sm text-slate-500">
                            <div class="flex -space-x-2">
                                <div class="w-8 h-8 rounded-full border-2 border-black bg-slate-800 flex items-center justify-center text-[10px]">AS</div>
                                <div class="w-8 h-8 rounded-full border-2 border-black bg-slate-700 flex items-center justify-center text-[10px]">RK</div>
                                <div class="w-8 h-8 rounded-full border-2 border-black bg-slate-600 flex items-center justify-center text-[10px]">JL</div>
                            </div>
                            <span>Joined by 2,400+ peak performers</span>
                        </div>
                    </div>
                </div>
                
                <!-- Right Side: Form -->
                <div class="w-full md:w-[60%] p-6 md:p-12 flex items-center justify-center bg-[#020617] relative">
                    <!-- Soft grid background -->
                    <div class="absolute inset-0 opacity-[0.03]" style="background-image: radial-gradient(#ffffff 1px, transparent 1px); background-size: 40px 40px;"></div>
                    
                    <div class="w-full max-w-xl relative z-10">
                        <div class="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-8 md:p-12 shadow-2xl animate-fade-in" style="animation-delay: 0.2s;">
                            <div class="space-y-8">
                                <div class="space-y-3">
                                    <label class="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Full Name</label>
                                    <input type="text" id="onboard-name" placeholder="John Wick" 
                                        class="w-full bg-slate-800/30 border border-white/5 rounded-2xl px-6 py-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#00f2ff]/30 focus:bg-slate-800/50 transition-all duration-300 text-lg">
                                </div>
                                
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div class="space-y-3">
                                        <label class="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Target Exam</label>
                                        <input type="text" id="onboard-exam" placeholder="JEE, NEET, UPSC, CA, or Board Exams..." 
                                            class="w-full bg-slate-800/30 border border-white/5 rounded-2xl px-6 py-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#00f2ff]/30 focus:bg-slate-800/50 transition-all duration-300 text-lg">
                                    </div>
                                    <div class="space-y-3">
                                        <label class="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Daily Goal (Hrs)</label>
                                        <div class="relative">
                                            <input type="number" id="onboard-hours" value="8" min="1" max="24"
                                                class="w-full bg-slate-800/30 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#00f2ff]/30 focus:bg-slate-800/50 transition-all duration-300 text-lg">
                                            <span class="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-medium">Hours</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="space-y-3">
                                    <label class="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Primary Focus Areas</label>
                                    <input type="text" id="onboard-subjects" placeholder="Mathematics, Physics, Ethics..." 
                                        class="w-full bg-slate-800/30 border border-white/5 rounded-2xl px-6 py-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#00f2ff]/30 focus:bg-slate-800/50 transition-all duration-300 text-lg">
                                    <p class="text-[10px] text-slate-600 uppercase tracking-wider ml-1">Separate subjects with commas</p>
                                </div>

                                <div class="space-y-3">
                                    <label class="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Study Time Preference</label>
                                    <div class="grid grid-cols-3 gap-4">
                                        <button class="preference-btn active border border-[#00f2ff]/30 bg-[#00f2ff]/5 text-[#00f2ff] rounded-xl py-3 text-sm font-semibold transition-all hover:scale-[1.02]" onclick="app.setPreference(this, 'Early Bird')">Early Bird</button>
                                        <button class="preference-btn border border-white/5 bg-slate-800/30 text-slate-400 rounded-xl py-3 text-sm font-semibold transition-all hover:bg-slate-800/50 hover:scale-[1.02]" onclick="app.setPreference(this, 'Night Owl')">Night Owl</button>
                                        <button class="preference-btn border border-white/5 bg-slate-800/30 text-slate-400 rounded-xl py-3 text-sm font-semibold transition-all hover:bg-slate-800/50 hover:scale-[1.02]" onclick="app.setPreference(this, 'Balanced')">Balanced</button>
                                    </div>
                                </div>

                                <button id="create-profile-btn" onclick="app.completeOnboarding()" 
                                    class="w-full bg-gradient-to-r from-[#00f2ff] to-[#7000ff] text-white font-bold py-5 rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transform hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 mt-4 flex items-center justify-center gap-3 text-lg group">
                                    <span>Create Profile</span>
                                    <i data-lucide="arrow-right" class="w-6 h-6 group-hover:translate-x-1 transition-transform"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        lucide.createIcons();
        this.selectedPreference = 'Early Bird';
    },

    setPreference(el, val) {
        document.querySelectorAll('.preference-btn').forEach(btn => {
            btn.classList.remove('active', 'border-[#00f2ff]/30', 'bg-[#00f2ff]/5', 'text-[#00f2ff]');
            btn.classList.add('border-white/5', 'bg-slate-800/30', 'text-slate-400');
        });
        el.classList.add('active', 'border-[#00f2ff]/30', 'bg-[#00f2ff]/5', 'text-[#00f2ff]');
        el.classList.remove('border-white/5', 'bg-slate-800/30', 'text-slate-400');
        this.selectedPreference = val;
    },
    
    completeOnboarding() {
        const name = document.getElementById('onboard-name').value;
        const exam = document.getElementById('onboard-exam').value;
        const hours = document.getElementById('onboard-hours').value;
        const subjects = document.getElementById('onboard-subjects').value;
        const preference = this.selectedPreference || 'Early Bird';
        
        if (!name) return alert('Name is required');
        
        this.user = {
            name, exam, targetHours: hours,
            subjects: subjects.split(',').map(s => s.trim()).filter(s => s),
            preference,
            stats: { consistency: 50, streak: 0, hours: [0,0,0,0,0,0,0] },
            joinedAt: new Date().toISOString()
        };
        
        Store.saveUser(this.user);
        window.location.href = '../dashboard/dashboard.html';
    },
    
    renderDashboard(el) {
        const stats = Store.getStats();
        const ai = this.aiPartner;
        
        // AI specific greeting/command
        const aiMessages = {
            enforcer: "Targets defined. Execution is mandatory. No room for slippage today.",
            coach: "Your peak performance state is waiting. Ready to optimize your flow?",
            strategist: "Strategic priorities identified. Focus on high-yield tasks first.",
            tracker: "Your streak is at stake. Maintain momentum. One session at a time."
        };

        el.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
                <!-- Top Header -->
                <div class="lg:col-span-12 flex justify-between items-center mb-4">
                    <div>
                        <h1 class="text-3xl font-bold">Execution Hub</h1>
                        <p class="text-slate-500">Welcome back, ${this.user.name}.</p>
                    </div>
                    <div class="flex gap-4">
                        <div class="custom-dropdown">
                            <div class="dropdown-trigger" onclick="app.toggleDropdown()">
                                <span id="current-duration-text">${this.selectedDuration} Min (Standard)</span>
                                <i data-lucide="chevron-down" style="width: 16px;"></i>
                            </div>
                            <div class="dropdown-menu" id="flow-dropdown-menu">
                                <div class="dropdown-item ${this.selectedDuration === 25 ? 'active' : ''}" onclick="app.selectDuration(25, '25 Min (Pomodoro)')">25 Min (Pomodoro)</div>
                                <div class="dropdown-item ${this.selectedDuration === 50 ? 'active' : ''}" onclick="app.selectDuration(50, '50 Min (Standard)')">50 Min (Standard)</div>
                                <div class="dropdown-item ${this.selectedDuration === 90 ? 'active' : ''}" onclick="app.selectDuration(90, '90 Min (Deep Flow)')">90 Min (Deep Flow)</div>
                            </div>
                        </div>
                        <button class="btn btn-primary px-8 py-3 rounded-2xl flex items-center gap-2" onclick="app.enterFlow()">
                            <i data-lucide="zap" class="w-4 h-4"></i> Enter Flow
                        </button>
                    </div>
                </div>

                <!-- AI Partner Side Panel (Right) -->
                <div class="lg:col-span-4 space-y-8 order-1 lg:order-2">
                    <div class="card glass-panel relative overflow-hidden p-8 rounded-[2rem] border-white/5">
                        <div class="absolute top-0 right-0 p-4 opacity-10">
                            <i data-lucide="${ai.avatar}" class="w-24 h-24"></i>
                        </div>
                        
                        <div class="flex items-center gap-4 mb-6">
                            <div class="w-12 h-12 rounded-xl flex items-center justify-center" style="background: ${ai.color}20; color: ${ai.color}">
                                <i data-lucide="${ai.avatar}" class="w-6 h-6"></i>
                            </div>
                            <div>
                                <h3 class="font-bold text-lg">${ai.name}</h3>
                                <span class="text-[10px] font-bold uppercase tracking-widest text-[#00ff88]">System Active</span>
                            </div>
                        </div>

                        <div class="bg-black/20 rounded-2xl p-4 mb-8">
                            <p class="text-sm text-slate-300 italic font-light">"${aiMessages[ai.id]}"</p>
                        </div>

                        <div class="space-y-6">
                            <div>
                                <label class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2 block">Today's Target</label>
                                <div id="daily-checkin-area">
                                    ${this.user.dailyTarget ? `
                                        <div class="flex items-center justify-between bg-slate-800/30 p-4 rounded-xl border border-white/5">
                                            <span class="font-medium">${this.user.dailyTarget}</span>
                                            <i data-lucide="check-circle" class="w-5 h-5 text-[#00ff88]"></i>
                                        </div>
                                    ` : `
                                        <div class="flex gap-2">
                                            <input type="text" id="daily-target-input" placeholder="What must be done?" class="w-full bg-slate-800/30 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[${ai.color}]/50">
                                            <button onclick="app.setDailyTarget()" class="p-3 rounded-xl bg-white text-black hover:bg-slate-200 transition-colors">
                                                <i data-lucide="arrow-right" class="w-5 h-5"></i>
                                            </button>
                                        </div>
                                    `}
                                </div>
                            </div>

                            <div class="pt-4 border-t border-white/5">
                                <label class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4 block">Next Action</label>
                                <button onclick="app.enterFlow()" class="w-full py-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-all text-sm font-bold flex items-center justify-center gap-3 group">
                                    Initialize Flow Session
                                    <i data-lucide="chevron-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="card glass-panel p-8 rounded-[2rem]">
                        <h3 class="font-bold mb-6">Execution Stats</h3>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-black/20 p-4 rounded-2xl">
                                <span class="text-[10px] text-slate-500 block mb-1 uppercase">Today</span>
                                <div class="text-xl font-bold">${stats.hours[6]}h</div>
                            </div>
                            <div class="bg-black/20 p-4 rounded-2xl">
                                <span class="text-[10px] text-slate-500 block mb-1 uppercase">Streak</span>
                                <div class="text-xl font-bold">${stats.streak}d</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Content (Left) -->
                <div class="lg:col-span-8 space-y-8 order-2 lg:order-1">
                    <div class="card glass-panel p-8 rounded-[2rem]">
                        <h3 class="font-bold mb-8">Weekly Performance</h3>
                        <div style="display: flex; gap: 1rem; height: 250px; align-items: flex-end;">
                            ${stats.hours.map((h, i) => `
                                <div class="flex-1 flex flex-col items-center gap-4 group">
                                    <div class="relative w-full">
                                        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">${h}h</div>
                                        <div class="w-full bg-gradient-to-t from-[${ai.color}]/20 to-[${ai.color}] rounded-xl transition-all duration-500 group-hover:shadow-[0_0_20px_${ai.color}40]" style="height: ${h * 20}px; opacity: ${i === 6 ? 1 : 0.4};"></div>
                                    </div>
                                    <span class="text-[10px] font-bold text-slate-500 uppercase">${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="card glass-panel p-8 rounded-[2rem]">
                            <div class="flex justify-between items-center mb-6">
                                <h3 class="font-bold text-lg">Active Sessions</h3>
                                <span class="text-[10px] font-bold text-slate-500">REAL-TIME</span>
                            </div>
                            <div class="space-y-4">
                                <div class="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
                                    <div class="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs">AS</div>
                                    <div class="flex-1">
                                        <div class="text-sm font-bold">Aryan S.</div>
                                        <div class="text-[10px] text-[#00ff88]">• IN FLOW (42m)</div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-4 p-4 bg-white/5 rounded-2xl opacity-50">
                                    <div class="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs">RK</div>
                                    <div class="flex-1">
                                        <div class="text-sm font-bold">Rahul K.</div>
                                        <div class="text-[10px] text-slate-500">IDLE</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card glass-panel p-8 rounded-[2rem]">
                            <h3 class="font-bold mb-6">System Status</h3>
                            <div class="space-y-6">
                                <div>
                                    <div class="flex justify-between text-[10px] font-bold uppercase mb-2">
                                        <span class="text-slate-500">System Consistency</span>
                                        <span class="text-[${ai.color}]">${stats.consistency}%</span>
                                    </div>
                                    <div class="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div class="h-full bg-[${ai.color}] rounded-full" style="width: ${stats.consistency}%"></div>
                                    </div>
                                </div>
                                <p class="text-[10px] text-slate-500 leading-relaxed uppercase tracking-wider">
                                    The AI Partner is monitoring your session frequency. Failure to maintain consistency will trigger corrective intervention.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    setDailyTarget() {
        const input = document.getElementById('daily-target-input');
        const target = input.value;
        if (!target) return;
        
        this.user.dailyTarget = target;
        Store.saveUser(this.user);
        this.navigate('dashboard');
    },
    
    renderBuddy(el) {
        const buddies = Store.getBuddies();
        el.innerHTML = `
            <h1>Study Buddy <span class="gradient-text">Matching</span></h1>
            <p style="color: var(--text-dim); margin-bottom: 2rem;">Matched based on your ${this.user.exam} goals and ${this.user.targetHours}h daily target.</p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem;">
                ${buddies.map(b => `
                    <div class="card">
                        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                            <div style="width: 48px; height: 48px; background: #333; border-radius: 50%;"></div>
                            <div>
                                <h3 style="margin: 0;">${b.name}</h3>
                                <span style="font-size: 0.8rem; color: var(--primary);">${b.exam} Aspirant</span>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 1.5rem;">
                            <div>
                                <div style="font-size: 0.7rem; color: var(--text-dim);">CONSISTENCY</div>
                                <div style="font-weight: 700;">${b.consistency}%</div>
                            </div>
                            <div>
                                <div style="font-size: 0.7rem; color: var(--text-dim);">STATUS</div>
                                <div style="color: ${b.status === 'In Flow' ? 'var(--primary)' : 'inherit'};">${b.status}</div>
                            </div>
                        </div>
                        <button class="btn btn-primary" style="width: 100%;">Propose Study Contract</button>
                    </div>
                `).join('')}
            </div>
        `;
    },
    
    renderChallenges(el) {
        const challenges = Store.getChallenges();
        el.innerHTML = `
            <h1>Active <span class="gradient-text">Challenges</span></h1>
            <p style="color: var(--text-dim); margin-bottom: 2rem;">Join challenges to compete and build unbreakable discipline.</p>
            
            <div style="display: grid; gap: 1.5rem;">
                ${challenges.map(c => `
                    <div class="card" style="display: flex; align-items: center; justify-content: space-between;">
                        <div>
                            <h3 style="margin: 0;">${c.title}</h3>
                            <span style="font-size: 0.8rem; color: var(--text-dim);">${c.participants} people participating</span>
                        </div>
                        <div style="width: 200px;">
                            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 5px;">
                                <span>Progress</span>
                                <span>${c.progress}%</span>
                            </div>
                            <div style="height: 6px; background: #333; border-radius: 3px;">
                                <div style="width: ${c.progress}%; height: 100%; background: var(--accent-gradient); border-radius: 3px;"></div>
                            </div>
                        </div>
                        <button class="btn btn-secondary">View Leaderboard</button>
                    </div>
                `).join('')}
            </div>
        `;
    },
    
    // --- Flow Mode Logic ---
    
    toggleDropdown() {
        document.getElementById('flow-dropdown-menu').classList.toggle('show');
    },

    selectDuration(duration, text) {
        this.selectedDuration = duration;
        document.getElementById('current-duration-text').textContent = text;
        this.toggleDropdown();
        this.navigate('dashboard'); // Re-render to update active class
    },

    enterFlow() {
        const duration = this.selectedDuration;
        const ai = this.aiPartner;
        const overlay = document.getElementById('flow-overlay');
        
        // AI Flow Start Messages
        const startMessages = {
            enforcer: "Locking environment. Do not break focus.",
            coach: "Breathe. Entering peak flow state now.",
            strategist: "Execution plan active. Focus on the core.",
            tracker: "Timer started. Protect the streak."
        };

        overlay.innerHTML = `
            <div class="flex flex-col items-center animate-fade-in">
                <div class="w-16 h-16 rounded-2xl mb-8 flex items-center justify-center animate-pulse" style="background: ${ai.color}20; color: ${ai.color}">
                    <i data-lucide="${ai.avatar}" class="w-8 h-8"></i>
                </div>
                <span class="section-tag mb-4">${ai.role} ACTIVE</span>
                <div class="timer-display" id="timer">${duration}:00</div>
                <p class="text-slate-400 mb-12 italic font-light">"${startMessages[ai.id]}"</p>
                <button class="px-8 py-3 rounded-xl border border-white/10 text-slate-500 hover:text-white transition-all text-xs font-bold" onclick="app.exitFlow()">Exit Flow (Penalty Applied)</button>
            </div>
        `;
        
        overlay.style.display = 'flex';
        lucide.createIcons();
        
        this.startTimer(duration * 60);
        
        document.getElementById('sidebar').classList.add('hidden');
        document.getElementById('app').classList.add('sidebar-collapsed');
    },
    
    exitFlow() {
        const ai = this.aiPartner;
        const warning = ai.id === 'enforcer' ? 
            'ABORTING WILL TRIGGER CONSISTENCY PENALTY. ARE YOU GIVING UP?' : 
            'Exiting now will break your streak. Continue?';
            
        if (!confirm(warning)) return;
        this.stopFlow();
    },
    
    stopFlow() {
        clearInterval(this.timerInterval);
        document.getElementById('flow-overlay').style.display = 'none';
        this.showSidebar();
        this.navigate('dashboard');
    },
    
    startTimer(seconds) {
        const timerEl = document.getElementById('timer');
        let remaining = seconds;
        
        this.timerInterval = setInterval(() => {
            remaining--;
            const mins = Math.floor(remaining / 60);
            const secs = remaining % 60;
            timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            
            if (remaining <= 0) {
                clearInterval(this.timerInterval);
                alert('Session Complete! Discipline scores updated.');
                this.stopFlow();
            }
        }, 1000);
    },
    
    renderAnalytics(el) { 
        const stats = Store.getStats();
        el.innerHTML = `
            <h1>Performance <span class="gradient-text">Analytics</span></h1>
            <p style="color: var(--text-dim); margin-bottom: 2rem;">Data-driven insights into your study discipline.</p>
            
            <div style="display: grid; gap: 2rem;">
                <div class="card">
                    <h3>Execution: You vs. Partner</h3>
                    <div style="display: flex; gap: 1rem; margin-top: 2rem; height: 200px; align-items: flex-end;">
                        ${stats.hours.map((h, i) => `
                            <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; position: relative;">
                                <div style="width: 15px; background: var(--primary); border-radius: 4px; height: ${h * 20}px; z-index: 2;"></div>
                                <div style="width: 15px; background: var(--secondary); border-radius: 4px; height: ${stats.partner_hours[i] * 20}px; position: absolute; bottom: 30px; opacity: 0.3;"></div>
                                <span style="font-size: 0.7rem; color: var(--text-dim); margin-top: 5px;">${['M','T','W','T','F','S','S'][i]}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div style="display: flex; gap: 2rem; margin-top: 1.5rem; justify-content: center;">
                        <div style="display: flex; align-items: center; gap: 8px; font-size: 0.8rem;"><div style="width: 12px; height: 12px; background: var(--primary); border-radius: 2px;"></div> You</div>
                        <div style="display: flex; align-items: center; gap: 8px; font-size: 0.8rem;"><div style="width: 12px; height: 12px; background: var(--secondary); border-radius: 2px; opacity: 0.5;"></div> Partner</div>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                    <div class="card">
                        <span style="font-size: 0.8rem; color: var(--text-dim);">AVG FOCUS SCORE</span>
                        <div style="font-size: 2.5rem; font-weight: 800;">8.4 <span style="font-size: 1rem; color: var(--primary);">/ 10</span></div>
                    </div>
                    <div class="card">
                        <span style="font-size: 0.8rem; color: var(--text-dim);">CONSISTENCY DELTA</span>
                        <div style="font-size: 2.5rem; font-weight: 800; color: #00ff88;">+12%</div>
                    </div>
                </div>
            </div>
        `;
    },

    renderCommunity(el) {
        const posts = Store.getCommunityPosts();
        el.innerHTML = `
            <h1>Community <span class="gradient-text">Pulse</span></h1>
            <p style="color: var(--text-dim); margin-bottom: 2rem;">High-signal progress updates from the Prepxflow network.</p>
            
            <div style="display: grid; gap: 1.5rem;">
                ${posts.map(p => `
                    <div class="card">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <div style="width: 32px; height: 32px; background: #333; border-radius: 50%;"></div>
                                <div style="font-weight: 600;">${p.user}</div>
                            </div>
                            <span style="font-size: 0.8rem; color: var(--text-dim);">${p.time}</span>
                        </div>
                        <p style="margin-bottom: 1rem;">${p.content}</p>
                        <div style="display: flex; gap: 0.5rem;">
                            ${p.tags.map(t => `<span style="font-size: 0.7rem; padding: 4px 10px; background: rgba(0,242,255,0.1); color: var(--primary); border-radius: 4px;">#${t}</span>`).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderProblems(el) { 
        const problems = Store.getProblems();
        el.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <div>
                    <h1>Problem <span class="gradient-text">Solver</span></h1>
                    <p style="color: var(--text-dim);">Structured Q&A for academic bottlenecks.</p>
                </div>
                <button class="btn btn-primary">Post Question</button>
            </div>
            
            <div style="display: grid; gap: 1.5rem;">
                ${problems.map(p => `
                    <div class="card" style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="flex: 1;">
                            <h3 style="margin-bottom: 5px;">${p.title}</h3>
                            <div style="font-size: 0.8rem; color: var(--text-dim);">
                                Asked by ${p.user} • ${p.answers} answers
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <span style="display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; background: ${p.status === 'Solved' ? 'rgba(0,255,136,0.1)' : 'rgba(255,255,255,0.05)'}; color: ${p.status === 'Solved' ? '#00ff88' : 'var(--text-dim)'};">
                                ${p.status}
                            </span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `; 
    },

    renderProfile(el) {
        el.innerHTML = `
            <h1>Profile <span class="gradient-text">Settings</span></h1>
            <p style="color: var(--text-dim); margin-bottom: 2rem;">Manage your discipline profile and study goals.</p>
            
            <div class="card glass-panel" style="max-width: 600px;">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" id="edit-name" value="${this.user.name}">
                </div>
                <div class="form-group">
                    <label>Target Exam</label>
                    <input type="text" id="edit-exam" value="${this.user.exam}" placeholder="JEE, NEET, UPSC, CA, or Board Exams...">
                </div>
                <div class="form-group">
                    <label>Daily Study Goal (Hours)</label>
                    <input type="number" id="edit-hours" value="${this.user.targetHours}">
                </div>
                
                <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.05);">
                    <button class="btn btn-primary" style="width: 100%;" onclick="app.saveProfile()">Update Profile</button>
                    <button class="btn btn-secondary" style="width: 100%; margin-top: 1rem;" onclick="app.logout()">Logout (Reset Data)</button>
                </div>
            </div>
        `;
    },

    saveProfile() {
        const name = document.getElementById('edit-name').value;
        const exam = document.getElementById('edit-exam').value;
        const hours = document.getElementById('edit-hours').value;
        
        if (!name) return alert('Name is required');
        
        this.user.name = name;
        this.user.exam = exam;
        this.user.targetHours = hours;
        
        Store.saveUser(this.user);
        this.showSidebar();
        alert('Profile updated successfully.');
        this.navigate('dashboard');
    },

    logout() {
        if (confirm('Are you sure? This will reset all your session data and streaks.')) {
            localStorage.removeItem('prepxflow_user');
            window.location.reload();
        }
    }
};

// Start App
app.init();
