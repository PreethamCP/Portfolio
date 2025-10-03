// Floating Particles System
class FloatingParticle {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = Math.random() * -0.5 - 0.1;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.fadeSpeed = Math.random() * 0.005 + 0.002;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Fade effect
        this.opacity -= this.fadeSpeed;
        
        // Reset particle if it goes off screen or fades out
        if (this.y < -10 || this.opacity <= 0) {
            this.y = this.canvas.height + 10;
            this.x = Math.random() * this.canvas.width;
            this.opacity = Math.random() * 0.5 + 0.3;
        }
        
        // Wrap horizontally
        if (this.x < -10) this.x = this.canvas.width + 10;
        if (this.x > this.canvas.width + 10) this.x = -10;
    }
    
    draw() {
        this.ctx.save();
        this.ctx.globalAlpha = this.opacity;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Add glow effect
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#00D9FF';
        this.ctx.fill();
        this.ctx.restore();
    }
}

// Initialize Particles
const particleCanvas = document.getElementById('particles');
const particleCtx = particleCanvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Create particles
for (let i = 0; i < 50; i++) {
    particles.push(new FloatingParticle(particleCanvas, particleCtx));
}

// Animate particles
function animateParticles() {
    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    requestAnimationFrame(animateParticles);
}

animateParticles();

// Smooth Scroll Carousel
class SmoothCarousel {
    constructor(wrapper, track, leftBtn, rightBtn) {
        this.wrapper = document.getElementById(wrapper);
        this.track = document.getElementById(track);
        this.leftBtn = document.getElementById(leftBtn);
        this.rightBtn = document.getElementById(rightBtn);
        
        if (!this.wrapper || !this.track) return;
        
        this.scrollAmount = 0;
        this.scrollStep = 350;
        this.maxScroll = this.track.scrollWidth - this.wrapper.clientWidth;
        
        this.init();
    }
    
    init() {
        if (this.leftBtn) {
            this.leftBtn.addEventListener('click', () => this.scrollLeft());
        }
        if (this.rightBtn) {
            this.rightBtn.addEventListener('click', () => this.scrollRight());
        }
        
        // Touch/Swipe support
        let startX = 0;
        let scrollLeft = 0;
        let isDown = false;
        
        this.track.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - this.track.offsetLeft;
            scrollLeft = this.scrollAmount;
        });
        
        this.track.addEventListener('mouseleave', () => {
            isDown = false;
        });
        
        this.track.addEventListener('mouseup', () => {
            isDown = false;
        });
        
        this.track.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - this.track.offsetLeft;
            const walk = (x - startX) * 2;
            this.scrollAmount = scrollLeft - walk;
            this.scrollAmount = Math.max(0, Math.min(this.scrollAmount, this.maxScroll));
            this.track.style.transform = `translateX(-${this.scrollAmount}px)`;
        });
        
        // Touch events
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - this.track.offsetLeft;
            scrollLeft = this.scrollAmount;
        });
        
        this.track.addEventListener('touchmove', (e) => {
            const x = e.touches[0].pageX - this.track.offsetLeft;
            const walk = (x - startX) * 2;
            this.scrollAmount = scrollLeft - walk;
            this.scrollAmount = Math.max(0, Math.min(this.scrollAmount, this.maxScroll));
            this.track.style.transform = `translateX(-${this.scrollAmount}px)`;
        });
        
        this.updateButtons();
    }
    
    scrollLeft() {
        this.scrollAmount = Math.max(0, this.scrollAmount - this.scrollStep);
        this.track.style.transform = `translateX(-${this.scrollAmount}px)`;
        this.updateButtons();
    }
    
    scrollRight() {
        this.scrollAmount = Math.min(this.maxScroll, this.scrollAmount + this.scrollStep);
        this.track.style.transform = `translateX(-${this.scrollAmount}px)`;
        this.updateButtons();
    }
    
    updateButtons() {
        if (this.leftBtn) {
            this.leftBtn.style.opacity = this.scrollAmount === 0 ? '0.3' : '1';
        }
        if (this.rightBtn) {
            this.rightBtn.style.opacity = this.scrollAmount >= this.maxScroll ? '0.3' : '1';
        }
    }
}

// Initialize Carousels
new SmoothCarousel('skills-wrapper', 'skills-track', 'skills-scroll-left', 'skills-scroll-right');
new SmoothCarousel('projects-wrapper', 'projects-track', 'projects-scroll-left', 'projects-scroll-right');

// Loader
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 1500);
});

// Navbar Scroll Effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    const currentScroll = window.scrollY;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle?.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animate skill levels
            if (entry.target.classList.contains('skill-item')) {
                const levelFill = entry.target.querySelector('.level-fill');
                if (levelFill) {
                    const level = levelFill.dataset.level;
                    setTimeout(() => {
                        levelFill.style.width = level + '%';
                    }, 300);
                }
            }
            
            // Counter animation for stats
            if (entry.target.classList.contains('stat-number')) {
                const target = parseInt(entry.target.dataset.target);
                const increment = target / 50;
                let current = 0;
                
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        entry.target.textContent = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        entry.target.textContent = target;
                    }
                };
                
                updateCounter();
            }
            
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.skill-item').forEach(el => observer.observe(el));
document.querySelectorAll('.stat-number').forEach(el => observer.observe(el));
document.querySelectorAll('.glass-card').forEach(el => observer.observe(el));

// Form Submission
const contactForm = document.querySelector('.contact-form');
contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.querySelector('span').textContent;
    
    submitBtn.querySelector('span').textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.querySelector('span').textContent = 'Message Sent! ✓';
        submitBtn.style.background = 'linear-gradient(135deg, #00FF88, #00D9FF)';
        
        setTimeout(() => {
            submitBtn.querySelector('span').textContent = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
            e.target.reset();
        }, 2000);
    }, 1500);
});

// Smooth Scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Parallax Effect on Mouse Move
document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    // Move aurora layers
    document.querySelectorAll('.aurora-layer').forEach((layer, index) => {
        const speed = (index + 1) * 2;
        const xPos = (x - 0.5) * speed * 10;
        const yPos = (y - 0.5) * speed * 10;
        layer.style.transform = `translate(${xPos}px, ${yPos}px)`;
    });
    
    // Move floating shapes
    document.querySelectorAll('.floating-shape').forEach((shape, index) => {
        const speed = (index + 1) * 1.5;
        const xPos = (x - 0.5) * speed * 20;
        const yPos = (y - 0.5) * speed * 20;
        shape.style.transform = `translate(${xPos}px, ${yPos}px)`;
    });
});

console.log('Portfolio initialized ✨');
