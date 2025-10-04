        // Custom cursor - only for desktop
        const cursor = document.querySelector('.cursor');
        const cursorDot = document.querySelector('.cursor-dot');

        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
            document.addEventListener('mousemove', (e) => {
                cursor.style.left = e.clientX - 20 + 'px';
                cursor.style.top = e.clientY - 20 + 'px';
                cursorDot.style.left = e.clientX - 2 + 'px';
                cursorDot.style.top = e.clientY - 2 + 'px';
            });

            document.querySelectorAll('a, button, .project').forEach(element => {
                element.addEventListener('mouseenter', () => {
                    cursor.style.transform = 'scale(1.5)';
                });
                element.addEventListener('mouseleave', () => {
                    cursor.style.transform = 'scale(1)';
                });
            });
        }

        // Mobile menu
        const menuToggle = document.getElementById('menuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu when clicking links
        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offset = 80; // Nav height
                    const targetPosition = target.offsetTop - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        entry.target.style.transition = 'all 0.6s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.project, .about-container, .contact').forEach(el => {
            observer.observe(el);
        });
