/**
 * Prepxflow 3D Immersive Experience
 * Powered by Three.js
 */

class ThreeExperience {
    constructor() {
        this.container = document.body;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        this.particles = null;
        this.shapes = [];
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };
        this.scrollPos = 0;
        this.targetScrollPos = 0;

        this.init();
    }

    init() {
        // Setup Renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.domElement.id = 'three-canvas';
        Object.assign(this.renderer.domElement.style, {
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: '-1',
            pointerEvents: 'none',
            background: 'transparent'
        });
        document.body.appendChild(this.renderer.domElement);

        this.camera.position.z = 5;

        this.createLights();
        this.createParticles();
        this.createFloatingShapes();
        
        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('scroll', () => this.onScroll());

        this.animate();
    }

    createLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        this.pointLight = new THREE.PointLight(0x3B82F6, 2, 50);
        this.pointLight.position.set(5, 5, 5);
        this.scene.add(this.pointLight);

        const violetLight = new THREE.PointLight(0x8B5CF6, 1, 50);
        violetLight.position.set(-5, -5, 2);
        this.scene.add(violetLight);
    }

    createParticles() {
        const geometry = new THREE.BufferGeometry();
        const count = 500;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 20;
            positions[i + 1] = (Math.random() - 0.5) * 20;
            positions[i + 2] = (Math.random() - 0.5) * 20;

            const color = Math.random() > 0.5 ? new THREE.Color(0x3B82F6) : new THREE.Color(0x8B5CF6);
            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        this.particlesMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(geometry, this.particlesMaterial);
        this.scene.add(this.particles);
    }

    createFloatingShapes() {
        const geometries = [
            new THREE.IcosahedronGeometry(0.5, 0),
            new THREE.TorusGeometry(0.3, 0.1, 16, 32),
            new THREE.BoxGeometry(0.4, 0.4, 0.4)
        ];

        for (let i = 0; i < 8; i++) {
            const material = new THREE.MeshPhongMaterial({
                color: i % 2 === 0 ? 0x3B82F6 : 0x8B5CF6,
                wireframe: true,
                transparent: true,
                opacity: 0.2
            });
            const shape = new THREE.Mesh(geometries[i % 3], material);
            
            shape.position.set(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            );
            
            shape.rotation.set(Math.random(), Math.random(), Math.random());
            shape.velocity = {
                r: Math.random() * 0.01,
                y: Math.random() * 0.01
            };
            
            this.shapes.push(shape);
            this.scene.add(shape);
        }
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseMove(e) {
        this.targetMouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
        this.targetMouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    }

    onScroll() {
        this.targetScrollPos = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Smooth Mouse Lerp
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

        // Smooth Scroll Lerp
        this.scrollPos += (this.targetScrollPos - this.scrollPos) * 0.05;

        // Animate Camera
        this.camera.position.x = this.mouse.x * 0.5;
        this.camera.position.y = this.mouse.y * 0.5;
        
        // Z-axis movement on scroll (depth transition)
        this.camera.position.z = 5 - this.scrollPos * 10;
        this.camera.lookAt(0, 0, -5);

        // Update point light to follow mouse
        this.pointLight.position.x = this.mouse.x * 10;
        this.pointLight.position.y = this.mouse.y * 10;

        // Rotate particles
        if (this.particles) {
            this.particles.rotation.y += 0.001;
            this.particles.rotation.x += 0.0005;
        }

        // Rotate and drift shapes
        this.shapes.forEach(shape => {
            shape.rotation.x += shape.velocity.r;
            shape.rotation.y += shape.velocity.y;
            shape.position.y += Math.sin(Date.now() * 0.001 + shape.position.x) * 0.002;
        });

        // Apply 3D tilt to HTML sections via CSS variables
        document.documentElement.style.setProperty('--mouse-x', this.mouse.x);
        document.documentElement.style.setProperty('--mouse-y', this.mouse.y);
        document.documentElement.style.setProperty('--scroll-3d', this.scrollPos);

        this.renderer.render(this.scene, this.camera);
    }

    updateTheme(theme) {
        if (!this.particlesMaterial) return;
        if (theme === 'light') {
            // Normal blending so particles show up on white backgrounds
            this.particlesMaterial.blending = THREE.NormalBlending;
            this.particlesMaterial.opacity = 0.4;
            this.shapes.forEach(shape => {
                shape.material.opacity = 0.5; // Make shapes darker/more visible
            });
        } else {
            // Additive blending looks glowing on dark backgrounds
            this.particlesMaterial.blending = THREE.AdditiveBlending;
            this.particlesMaterial.opacity = 0.6;
            this.shapes.forEach(shape => {
                shape.material.opacity = 0.2;
            });
        }
    }
}

let threeApp = null;
// Ensure Three.js is loaded before starting
const startThree = () => {
    if (typeof THREE !== 'undefined') {
        threeApp = new ThreeExperience();
        // Set initial theme for 3D
        const theme = localStorage.getItem('prepxflow_theme') || 'dark';
        threeApp.updateTheme(theme);
    } else {
        setTimeout(startThree, 100);
    }
};

document.addEventListener('DOMContentLoaded', startThree);
