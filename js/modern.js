// ==========================================
// PINEY DIGITAL - MODERN 2026/2027 INTERACTIONS
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP plugins
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // ==========================================
    // THEME TOGGLE
    // ==========================================
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // ==========================================
    // NAVIGATION
    // ==========================================
    const nav = document.getElementById('nav');
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

    // Scroll effect for nav
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close mobile menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ==========================================
    // CURSOR GLOW EFFECT
    // ==========================================
    const cursorGlow = document.getElementById('cursorGlow');
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (cursorGlow) {
            cursorGlow.classList.add('active');
        }
    });

    document.addEventListener('mouseleave', function() {
        if (cursorGlow) {
            cursorGlow.classList.remove('active');
        }
    });

    // Smooth follow animation
    function animateGlow() {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;

        if (cursorGlow) {
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
        }

        requestAnimationFrame(animateGlow);
    }
    animateGlow();

    // ==========================================
    // MAGNETIC BUTTONS
    // ==========================================
    const magneticButtons = document.querySelectorAll('.magnetic');

    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0)';
        });
    });

    // ==========================================
    // SMOOTH SCROLL
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();

                const navHeight = nav ? nav.offsetHeight : 0;
                const targetPosition = target.offsetTop - navHeight;

                gsap.to(window, {
                    scrollTo: { y: targetPosition, autoKill: false },
                    duration: 1,
                    ease: 'power3.inOut'
                });
            }
        });
    });

    // ==========================================
    // SCROLL ANIMATIONS
    // ==========================================
    const animateElements = document.querySelectorAll('.animate-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(el => observer.observe(el));

    // ==========================================
    // COUNTER ANIMATION
    // ==========================================
    const counters = document.querySelectorAll('.stat-number[data-value]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-value'));
                const duration = 2000;
                const start = 0;
                const startTime = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    // Ease out cubic
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(start + (target - start) * easeOut);

                    counter.textContent = current;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                }

                requestAnimationFrame(updateCounter);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // ==========================================
    // FORM HANDLING
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');

            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            try {
                const formData = new FormData(this);
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formMessage.className = 'form-message success';
                    formMessage.textContent = 'Thanks! Joel will contact you within 24 hours.';
                    formMessage.style.display = 'block';
                    contactForm.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                formMessage.className = 'form-message error';
                formMessage.textContent = 'Something went wrong. Please try again or call us directly.';
                formMessage.style.display = 'block';
            } finally {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        });
    }

    // ==========================================
    // PARALLAX EFFECTS
    // ==========================================
    gsap.to('.blob-1', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: 100,
        scale: 1.2
    });

    gsap.to('.blob-2', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: -100,
        scale: 1.1
    });

    // ==========================================
    // HOVER EFFECTS FOR CARDS
    // ==========================================
    const bentoCards = document.querySelectorAll('.bento-card');

    bentoCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ==========================================
    // WORK CARDS HOVER
    // ==========================================
    const workCards = document.querySelectorAll('.work-card');

    workCards.forEach(card => {
        const image = card.querySelector('.work-placeholder');

        card.addEventListener('mouseenter', function() {
            gsap.to(image, {
                scale: 1.1,
                duration: 0.5,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', function() {
            gsap.to(image, {
                scale: 1,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });

    // ==========================================
    // ABOUT CARD ANIMATION
    // ==========================================
    gsap.fromTo('.about-card .card-line',
        { scaleX: 0 },
        {
            scaleX: 1,
            duration: 1,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.about-card',
                start: 'top 80%'
            }
        }
    );

    // ==========================================
    // PRICING CARDS STAGGER
    // ==========================================
    gsap.fromTo('.pricing-card',
        { y: 50, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.pricing-grid',
                start: 'top 80%'
            }
        }
    );

    // ==========================================
    // INITIAL ANIMATIONS
    // ==========================================
    gsap.from('.hero-badge', { opacity: 0, y: 30, duration: 0.6, delay: 0.2 });
    gsap.from('.hero-title .title-line', { opacity: 0, y: 50, duration: 0.8, stagger: 0.15, delay: 0.4 });
    gsap.from('.hero-description', { opacity: 0, y: 30, duration: 0.6, delay: 0.8 });
    gsap.from('.hero-stats', { opacity: 0, y: 30, duration: 0.6, delay: 1 });
    gsap.from('.hero-cta', { opacity: 0, y: 30, duration: 0.6, delay: 1.2 });

    // ==========================================
    // SPOTLIGHT ENTRANCE EFFECT
    // ==========================================
    const spotlightEntrance = document.getElementById('spotlightEntrance');
    const hasSeenSpotlight = sessionStorage.getItem('spotlightSeen');

    // Only show spotlight on homepage and once per session
    if (spotlightEntrance && !hasSeenSpotlight) {
        spotlightEntrance.classList.remove('hidden');

        // Mark as seen after animation completes
        setTimeout(() => {
            sessionStorage.setItem('spotlightSeen', 'true');
            spotlightEntrance.classList.add('hidden');
        }, 4500); // Total animation duration
    }

    // ==========================================
    // PREFERS REDUCED MOTION
    // ==========================================
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.globalTimeline.clear();
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        // Hide spotlight for reduced motion preference
        if (spotlightEntrance) {
            spotlightEntrance.classList.add('hidden');
        }
    }

    console.log('🌲 Piney Digital - Modern 2026 Design Loaded');
});