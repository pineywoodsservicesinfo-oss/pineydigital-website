// ==========================================
// PINEY DIGITAL - PROFESSIONAL WEB DESIGN
// Main JavaScript File
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // MOBILE NAVIGATION
    // ==========================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Close mobile menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // ==========================================
    // STICKY NAVIGATION
    // ==========================================
    // Ensure navbar is defined at the top of your script or inside the listener
    const navbar = document.getElementById('navbar');

    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const targetId = href.includes('#') ? href.split('#')[1] : null;
            const target = targetId ? document.getElementById(targetId) : null;
        
            if (target) {
                e.preventDefault();
                // Use the navbar variable here
                const navHeight = navbar ? navbar.offsetHeight : 0;
                window.scrollTo({
                    top: target.offsetTop - navHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ==========================================
    // SMOOTH SCROLLING FOR ANCHOR LINKS (Updated for Multi-Page)
    // ==========================================
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
        
            // Get only the hash part (e.g., "#services" from "index.html#services")
            const targetId = href.substring(href.indexOf('#'));
        
            if (targetId === '#' || targetId === '') return;
        
            const target = document.querySelector(targetId);
        
            // Only smooth scroll and prevent default IF the section exists on this page
            if (target) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
            
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
            // If target doesn't exist (e.g., navigating from Blog to Home#services), 
            // the browser will perform its default action and load the new page.
        });
    });
    // ==========================================
    // ACTIVE NAVIGATION LINK
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavigation() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavigation);
    highlightNavigation(); // Call once on load
    
    // ==========================================
    // BACK TO TOP BUTTON
    // ==========================================
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ==========================================
    // FAQ ACCORDION
    // ==========================================
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(button => {
        button.addEventListener('click', function() {
            const faqItem = this.closest('.faq-item');
            const isActive = faqItem.classList.contains('active');

            // Close all other FAQ items
            document.querySelectorAll('.faq-item.active').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Toggle current item
            if (!isActive) {
                faqItem.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ==========================================
    // PHONE NUMBER FORMATTING
    // ==========================================
    const phoneInput = document.getElementById('phone');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = `(${value}`;
                } else if (value.length <= 6) {
                    value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                } else {
                    value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                }
            }
            
            e.target.value = value;
        });
    }
    
    // ==========================================
    // CONTACT FORM VALIDATION & SUBMISSION
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                business: document.getElementById('business').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                package: document.getElementById('package').value,
                message: document.getElementById('message').value.trim()
            };
            
            // Basic validation
            if (!formData.name || !formData.business || !formData.email || !formData.phone || !formData.message) {
                showMessage('Please fill in all required fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Phone validation (at least 10 digits)
            const phoneDigits = formData.phone.replace(/\D/g, '');
            if (phoneDigits.length < 10) {
                showMessage('Please enter a valid phone number.', 'error');
                return;
            }
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;

            try {
                // Send to Railway backend
                const response = await fetch('https://pineydigital-production.up.railway.app/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    showMessage('Thank you! Your quote request has been received. We\'ll get back to you within 24 hours!', 'success');
                    contactForm.reset();

                    // Auto-hide success message after 8 seconds
                    setTimeout(() => {
                        formMessage.style.display = 'none';
                    }, 8000);
                } else {
                    throw new Error('Submission failed');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showMessage('Oops! Something went wrong. Please call us at (936) 299-9897 or try again later.', 'error');
            } finally {
                submitButton.disabled = false;
            }
        });
    }
    
    function showMessage(message, type) {
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = `form-message ${type}`;
            formMessage.style.display = 'block';
            
            // Scroll to message
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    // ==========================================
    // SCROLL REVEAL ANIMATIONS
    // ==========================================
    const revealElements = document.querySelectorAll('.benefit-card, .package-card, .portfolio-item, .process-step, .stat-card');
    
    function reveal() {
        const windowHeight = window.innerHeight;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const revealPoint = 100;
            
            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('fade-in-up');
            }
        });
    }
    
    window.addEventListener('scroll', reveal);
    reveal(); // Call once on load
    
    // ==========================================
    // PRICE HIGHLIGHT ANIMATION
    // ==========================================
    const priceElements = document.querySelectorAll('.price-current');
    
    const priceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    entry.target.style.transform = 'scale(1)';
                }, 300);
                priceObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    priceElements.forEach(price => {
        price.style.transition = 'transform 0.3s ease';
        priceObserver.observe(price);
    });
    
    // ==========================================
    // PACKAGE CARD INTERACTIONS
    // ==========================================
    const packageCards = document.querySelectorAll('.package-card');
    
    packageCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // ==========================================
    // LAZY LOADING IMAGES (if any are added later)
    // ==========================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ==========================================
    // PREVENT FORM RESUBMISSION
    // ==========================================
    if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.href);
    }
    
    // ==========================================
    // CONSOLE MESSAGE (Easter Egg)
    // ==========================================
    console.log('%c🌲 Piney Digital', 'color: #1e5a8e; font-size: 24px; font-weight: bold;');
    console.log('%cProfessional Web Design for East Texas Businesses', 'color: #2d7f4e; font-size: 14px;');
    console.log('%cBuilt with ❤️ in East Texas', 'color: #ff8c42; font-size: 12px;');
    console.log('%cNeed a website? Call (936) 299-9897', 'color: #6b7280; font-size: 12px;');
    
    // ==========================================
    // PERFORMANCE OPTIMIZATION
    // ==========================================
    
    // Debounce function for scroll events
    function debounce(func, wait = 10) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Apply debounce to scroll-heavy functions
    window.addEventListener('scroll', debounce(function() {
        highlightNavigation();
        reveal();
    }, 10));
    
    // ==========================================
    // ACCESSIBILITY ENHANCEMENTS
    // ==========================================
    
    // Add keyboard navigation for mobile menu
    if (hamburger) {
        hamburger.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
    
    // Focus management for modal-like mobile menu
    const firstFocusableElement = navMenu?.querySelector('a');
    const lastFocusableElement = navMenu?.querySelectorAll('a');
    
    if (navMenu && navMenu.classList.contains('active')) {
        firstFocusableElement?.focus();
    }
    
    // Trap focus in mobile menu when open
    document.addEventListener('keydown', function(e) {
        if (!navMenu?.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            hamburger?.click();
        }
    });
    
    // ==========================================
    // PAGE LOAD ANIMATIONS
    // ==========================================
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Fade in hero content
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }, 100);
        }
    });
    
    // ==========================================
    // DYNAMIC YEAR IN FOOTER
    // ==========================================
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(el => {
        el.textContent = currentYear;
    });
    
    // ==========================================
    // CLICK TRACKING (for analytics integration)
    // ==========================================
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            const buttonHref = this.getAttribute('href');
            
            // Log for future analytics integration
            console.log('Button clicked:', {
                text: buttonText,
                href: buttonHref,
                timestamp: new Date().toISOString()
            });
            
            // Future: Send to analytics service
            // analytics.track('button_click', { text: buttonText, href: buttonHref });
        });
    });
    
    // ==========================================
    // PHONE & EMAIL LINK TRACKING
    // ==========================================
    document.querySelectorAll('a[href^="tel:"], a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', function() {
            const type = this.href.startsWith('tel:') ? 'phone' : 'email';
            const value = this.href.replace(/^(tel:|mailto:)/, '');
            
            console.log('Contact link clicked:', {
                type: type,
                value: value,
                timestamp: new Date().toISOString()
            });
            
            // Future: Send to analytics service
            // analytics.track('contact_click', { type: type, value: value });
        });
    });
    
    // ==========================================
    // PACKAGE SELECTION TRACKING
    // ==========================================
    document.querySelectorAll('.package-card .btn').forEach(button => {
        button.addEventListener('click', function() {
            const packageCard = this.closest('.package-card');
            const packageName = packageCard?.querySelector('.package-name')?.textContent;
            const packagePrice = packageCard?.querySelector('.price-current')?.textContent;
            
            console.log('Package selected:', {
                name: packageName,
                price: packagePrice,
                timestamp: new Date().toISOString()
            });
            
            // Future: Send to analytics service
            // analytics.track('package_selected', { name: packageName, price: packagePrice });
        });
    });
    
});

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Get scroll percentage
function getScrollPercentage() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    return (scrollTop / scrollHeight) * 100;
}

// Export for potential use in other scripts
window.pineyDigital = {
    isInViewport,
    getScrollPercentage
};