/**
 * Prepxflow Live Animated Background
 * Neural Network / Particle Flow with Mouse Interaction
 */

class FlowBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 100;
        this.mouse = { x: -1000, y: -1000, active: false };
        this.colors = {
            blue: '#3B82F6',
            violet: '#8B5CF6',
            bg: '#020617'
        };

        this.init();
    }

    init() {
        // Setup Canvas
        this.canvas.id = 'flow-bg-canvas';
        Object.assign(this.canvas.style, {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: '-1',
            pointerEvents: 'none',
            background: this.colors.bg
        });
        document.body.appendChild(this.canvas);

        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Mouse Events
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.mouse.active = true;
        });

        window.addEventListener('mouseleave', () => {
            this.mouse.active = false;
        });

        // Create Particles
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(this.createParticle());
        }

        this.animate();
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            baseX: Math.random() * this.canvas.width,
            baseY: Math.random() * this.canvas.height,
            size: Math.random() * 2 + 1,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            color: Math.random() > 0.5 ? this.colors.blue : this.colors.violet,
            opacity: Math.random() * 0.5 + 0.2,
            z: Math.random() * 0.5 + 0.5 // Depth factor for parallax
        };
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Connections First (Neural Web)
        this.ctx.lineWidth = 0.5;
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    const alpha = (1 - dist / 150) * 0.2;
                    this.ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`; // Violet connections
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }

        // Update and Draw Particles
        this.particles.forEach(p => {
            // Idle movement
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            // Mouse Interaction (Magnetic Pull + Parallax)
            if (this.mouse.active) {
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = 300;

                if (dist < maxDist) {
                    const force = (maxDist - dist) / maxDist;
                    const pull = force * 0.05 * p.z; // Depth-based pull
                    p.x += dx * pull;
                    p.y += dy * pull;
                    
                    // Increase glow near cursor
                    p.glow = force;
                } else {
                    p.glow = 0;
                }
            }

            // Draw Particle
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.opacity + (p.glow || 0);
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size + (p.glow || 0) * 2, 0, Math.PI * 2);
            this.ctx.fill();

            // Subtle glow circle
            if (p.glow > 0.5) {
                this.ctx.shadowBlur = 15;
                this.ctx.shadowColor = p.color;
            } else {
                this.ctx.shadowBlur = 0;
            }
        });
        
        this.ctx.globalAlpha = 1;
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Start Background
document.addEventListener('DOMContentLoaded', () => {
    new FlowBackground();
});
