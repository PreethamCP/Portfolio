// Enhanced Electron System with More Particles and Better Physics
class Electron {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.reset();
        
        // Random properties for variation
        this.baseSpeed = Math.random() * 0.5 + 0.5;
        this.attractionStrength = Math.random() * 0.3 + 0.2;
        this.maxSpeed = Math.random() * 3 + 2;
        this.friction = 0.985 + Math.random() * 0.01;
        
        // Updated color variations with new scheme
        const colors = [
            'hsl(245, 100%, 70%)', // Purple
            'hsl(290, 100%, 75%)', // Pink
            'hsl(200, 100%, 65%)', // Blue
            'hsl(180, 100%, 60%)', // Cyan
            'hsl(260, 100%, 70%)'  // Violet
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        
        // Pulsing effect
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.05 + 0.02;
    }
    
    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.radius = Math.random() * 2.5 + 1;
        this.originalRadius = this.radius;
    }

    update(mouseX, mouseY, electrons) {
        // Calculate distance to mouse
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Enhanced mouse attraction with variable strength based on distance
        if (distance < 200) {
            const force = Math.pow((200 - distance) / 200, 2);
            const angle = Math.atan2(dy, dx);
            const attractionX = Math.cos(angle) * force * this.attractionStrength;
            const attractionY = Math.sin(angle) * force * this.attractionStrength;
            
            this.vx += attractionX;
            this.vy += attractionY;
            
            // Add some perpendicular force for orbital motion
            if (distance < 100) {
                const orbitalForce = force * 0.1;
                this.vx += -Math.sin(angle) * orbitalForce;
                this.vy += Math.cos(angle) * orbitalForce;
            }
        }

        // Repulsion from other electrons (creates more interesting patterns)
        electrons.forEach(other => {
            if (other !== this) {
                const dx = other.x - this.x;
                const dy = other.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 50 && distance > 0) {
                    const force = (50 - distance) / 50 * 0.05;
                    const angle = Math.atan2(dy, dx);
                    this.vx -= Math.cos(angle) * force;
                    this.vy -= Math.sin(angle) * force;
                }
            }
        });

        // Add random wandering force
        this.vx += (Math.random() - 0.5) * 0.05;
        this.vy += (Math.random() - 0.5) * 0.05;

        // Apply friction
        this.vx *= this.friction;
        this.vy *= this.friction;

        // Limit maximum speed
        const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (currentSpeed > this.maxSpeed) {
            this.vx = (this.vx / currentSpeed) * this.maxSpeed;
            this.vy = (this.vy / currentSpeed) * this.maxSpeed;
        }

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around edges with smooth transition
        const margin = 50;
        if (this.x < -margin) this.x = this.canvas.width + margin;
        if (this.x > this.canvas.width + margin) this.x = -margin;
        if (this.y < -margin) this.y = this.canvas.height + margin;
        if (this.y > this.canvas.height + margin) this.y = -margin;

        // Pulsing effect
        this.pulsePhase += this.pulseSpeed;
        this.radius = this.originalRadius + Math.sin(this.pulsePhase) * 0.5;
    }

    draw() {
        // Main particle with glow effect
        this.ctx.save();
        
        // Outer glow
        const gradient = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 4);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(0.5, this.color.replace('70%', '30%'));
        gradient.addColorStop(1, 'transparent');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius * 4, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Inner bright core
        this.ctx.fillStyle = this.color;
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Bright center
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius * 0.3, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }
}

// Carousel Class
class Carousel {
    constructor(element, options = {}) {
        this.carousel = element;
        this.track = element.querySelector('.carousel-track');
        this.cards = Array.from(this.track.children);
        this.prevBtn = document.getElementById(options.prevBtn);
        this.nextBtn = document.getElementById(options.nextBtn);
        this.indicatorsContainer = document.getElementById(options.indicators);
        
        this.currentIndex = 0;
        this.cardWidth = this.cards[0].offsetWidth + 32; // Including gap
        this.cardsPerView = Math.floor(this.carousel.offsetWidth / this.cardWidth);
        this.maxIndex = Math.max(0, this.cards.length - this.cardsPerView);
        
        // Touch/swipe variables
        this.startX = 0;
        this.currentX = 0;
        this.isDragging = false;
        this.startTransform = 0;
        
        this.init();
    }
    
    init() {
        // Create indicators
        this.createIndicators();
        
        // Button events
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }
        
        // Touch events
        this.track.addEventListener('mousedown', (e) => this.startDrag(e));
        this.track.addEventListener('touchstart', (e) => this.startDrag(e));
        
        this.track.addEventListener('mousemove', (e) => this.drag(e));
        this.track.addEventListener('touchmove', (e) => this.drag(e));
        
        this.track.addEventListener('mouseup', (e) => this.endDrag(e));
        this.track.addEventListener('touchend', (e) => this.endDrag(e));
        
        this.track.addEventListener('mouseleave', (e) => this.endDrag(e));
        
        // Keyboard navigation
        this.carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
        
        // Resize handler
        window.addEventListener('resize', () => this.handleResize());
        
        // Update button states
        this.updateButtons();
    }
    
    createIndicators() {
        if (!this.indicatorsContainer) return;
        
        this.indicatorsContainer.innerHTML = '';
        const numIndicators = this.maxIndex + 1;
        
        for (let i = 0; i < numIndicators; i++) {
            const indicator = document.createElement('span');
            indicator.className = 'indicator';
            if (i === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => this.goToSlide(i));
            this.indicatorsContainer.appendChild(indicator);
        }
    }
    
    updateIndicators() {
        if (!this.indicatorsContainer) return;
        
        const indicators = this.indicatorsContainer.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    startDrag(e) {
        this.isDragging = true;
        this.startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        this.startTransform = this.currentIndex * this.cardWidth;
        this.track.style.cursor = 'grabbing';
        this.track.style.transition = 'none';
    }
    
    drag(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        this.currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const diff = this.startX - this.currentX;
        const transform = this.startTransform + diff;
        
        // Add resistance at boundaries
        if (transform < 0 || transform > this.maxIndex * this.cardWidth) {
            const resistance = 0.3;
            this.track.style.transform = `translateX(-${this.startTransform + diff * resistance}px)`;
        } else {
            this.track.style.transform = `translateX(-${transform}px)`;
        }
    }
    
    endDrag(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.track.style.cursor = 'grab';
        this.track.style.transition = '';
        
        const diff = this.startX - this.currentX;
        const threshold = this.cardWidth / 4;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        } else {
            this.goToSlide(this.currentIndex);
        }
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
        }
    }
    
    next() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
            this.updateCarousel();
        }
    }
    
    goToSlide(index) {
        this.currentIndex = Math.max(0, Math.min(index, this.maxIndex));
        this.updateCarousel();
    }
    
    updateCarousel() {
        const transform = this.currentIndex * this.cardWidth;
        this.track.style.transform = `translateX(-${transform}px)`;
        this.updateButtons();
        this.updateIndicators();
    }
    
    updateButtons() {
        if (this.prevBtn) {
            this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
            this.prevBtn.style.pointerEvents = this.currentIndex === 0 ? 'none' : 'auto';
        }
        if (this.nextBtn) {
            this.nextBtn.style.opacity = this.currentIndex === this.maxIndex ? '0.5' : '1';
            this.nextBtn.style.pointerEvents = this.currentIndex === this.maxIndex ? 'none' : 'auto';
        }
    }
    
    handleResize() {
        this.cardWidth = this.cards[0].offsetWidth + 32;
        this.cardsPerView = Math.floor(this.carousel.offsetWidth / this.cardWidth);
        this.maxIndex = Math.max(0, this.cards.length - this.cardsPerView);
        this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
        this.updateCarousel();
        this.createIndicators();
    }
}

// Initialize carousels
let skillsCarousel, projectsCarousel;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Skills Carousel
    const skillsElement = document.getElementById('skills-carousel');
    if (skillsElement) {
        skillsCarousel = new Carousel(skillsElement, {
            prevBtn: 'skills-prev',
            nextBtn: 'skills-next',
            indicators: 'skills-indicators'
        });
    }
    
    // Initialize Projects Carousel
    const projectsElement = document.getElementById('projects-carousel');
    if (projectsElement) {
        projectsCarousel = new Carousel(projectsElement, {
            prevBtn: 'projects-prev',
            nextBtn: 'projects-next',
            indicators: 'projects-indicators'
        });
    }
});

// Initialize enhanced electron system
const electronCanvas = document.getElementById('electrons');
const electronCtx = electronCanvas.getContext('2d');
let electrons = [];
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

function resizeElectronCanvas() {
    electronCanvas.width = window.innerWidth;
    electronCanvas.height = window.innerHeight;
}

resizeElectronCanvas();
window.addEventListener('resize', () => {
    resizeElectronCanvas();
    // Reinitialize electrons on resize
    electrons = [];
    for (let i = 0; i < 75; i++) {
        electrons.push(new Electron(electronCanvas, electronCtx));
    }
});

// Create more electrons
for (let i = 0; i < 75; i++) {
    electrons.push(new Electron(electronCanvas, electronCtx));
}

// Track mouse position with velocity
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Move galaxy elements based on mouse with parallax
    const galaxies = document.querySelectorAll('.galaxy');
    galaxies.forEach((galaxy, index) => {
        const speed = (index + 1) * 0.03;
        const x = (mouseX - window.innerWidth / 2) * speed;
        const y = (mouseY - window.innerHeight / 2) * speed;
        galaxy.style.transform = `translate(${x}px, ${y}px) scale(${1 + Math.abs(speed)})`;
    });

    // Parallax effect for hero elements
    const parallaxElements = document.querySelectorAll('.parallax-element');
    const x = mouseX / window.innerWidth;
    const y = mouseY / window.innerHeight;

    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 1;
        const xPos = (x - 0.5) * speed * 30;
        const yPos = (y - 0.5) * speed * 30;
        element.style.transform = `translate(${xPos}px, ${yPos}px)`;
    });
});

// Enhanced electron animation with trails
function animateElectrons() {
    // Create trail effect
    electronCtx.fillStyle = 'rgba(10, 14, 39, 0.1)';
    electronCtx.fillRect(0, 0, electronCanvas.width, electronCanvas.height);
    
    // Update and draw electrons
    electrons.forEach(electron => {
        electron.update(mouseX, mouseY, electrons);
        electron.draw();
    });

    // Draw connections between nearby electrons
    electronCtx.strokeStyle = 'rgba(102, 126, 234, 0.1)';
    electronCtx.lineWidth = 1;
    
    for (let i = 0; i < electrons.length; i++) {
        for (let j = i + 1; j < electrons.length; j++) {
            const dx = electrons[i].x - electrons[j].x;
            const dy = electrons[i].y - electrons[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                const opacity = (1 - distance / 120) * 0.5;
                electronCtx.strokeStyle = `rgba(102, 126, 234, ${opacity})`;
                electronCtx.beginPath();
                electronCtx.moveTo(electrons[i].x, electrons[i].y);
                electronCtx.lineTo(electrons[j].x, electrons[j].y);
                electronCtx.stroke();
            }
        }
    }

    // Draw connections to mouse when close
    electrons.forEach(electron => {
        const dx = mouseX - electron.x;
        const dy = mouseY - electron.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
            const opacity = (1 - distance / 100) * 0.3;
            electronCtx.strokeStyle = `rgba(240, 147, 251, ${opacity})`;
            electronCtx.lineWidth = 2;
            electronCtx.beginPath();
            electronCtx.moveTo(electron.x, electron.y);
            electronCtx.lineTo(mouseX, mouseY);
            electronCtx.stroke();
        }
    });

    requestAnimationFrame(animateElectrons);
}

animateElectrons();

// Create enhanced galaxy background
function createGalaxyBackground() {
    const galaxyBg = document.getElementById('galaxy-bg');
    
    // Create more varied stars
    for (let i = 0; i < 300; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 3 + 0.5;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 5 + 's';
        star.style.animationDuration = (Math.random() * 3 + 2) + 's';
        galaxyBg.appendChild(star);
    }

    // Create multiple galaxy clouds
    for (let i = 0; i < 8; i++) {
        const galaxy = document.createElement('div');
        galaxy.className = i % 2 === 0 ? 'galaxy' : 'galaxy small';
        galaxy.style.left = Math.random() * 100 + '%';
        galaxy.style.top = Math.random() * 100 + '%';
        galaxy.style.animationDelay = Math.random() * 10 + 's';
        galaxy.style.animationDuration = (20 + Math.random() * 10) + 's';
        galaxyBg.appendChild(galaxy);
    }
}

createGalaxyBackground();

// Loader
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 1500);
});

// Navbar scroll effect
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Hide/show navbar on scroll
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollY = currentScrollY;
});

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Enhanced Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add staggered animation delay
            setTimeout(() => {
                entry.target.classList.add('visible');
                
                // Animate skill bars
                if (entry.target.classList.contains('skill-card')) {
                    const skillBar = entry.target.querySelector('.skill-progress');
                    if (skillBar) {
                        const skill = skillBar.dataset.skill;
                        setTimeout(() => {
                            skillBar.style.width = skill + '%';
                        }, 300);
                    }
                }
            }, index * 100);
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

document.querySelectorAll('.skill-card').forEach(el => {
    observer.observe(el);
});

document.querySelectorAll('.project-card').forEach(el => {
    observer.observe(el);
});

// Form submission with animation
document.querySelector('.contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const button = e.target.querySelector('.btn');
    const originalText = button.textContent;
    
    // Animate button
    button.textContent = 'Sending...';
    button.style.background = 'linear-gradient(135deg, #43e97b, #38f9d7)';
    
    setTimeout(() => {
        button.textContent = 'Message Sent! ✓';
        button.style.background = 'linear-gradient(135deg, #43e97b, #00f2fe)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            e.target.reset();
        }, 2000);
    }, 1500);
});

// Smooth scroll for anchor links
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

// Enhanced button ripple effect
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.width = '0';
        ripple.style.height = '0';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.animation = 'ripple 0.8s ease-out';
        ripple.style.pointerEvents = 'none';
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 800);
    });
});

// Touch support for mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
    }
});

// Initialize everything when DOM is ready
console.log('Portfolio initialized successfully!');