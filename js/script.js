// Project data (edit to add your own)
const PROJECTS = [
    {
        title: 'Delhi47 Hardware Store',
        description: 'A real-world storefront website built for a local hardware business. Designed to showcase product categories clearly and help customers understand offerings without confusion.',
        tags: ['HTML', 'CSS'],
        url: 'https://warningod.me/Delhi47-Website/',
        details: ['Focus on usability', 'Mobile-friendly layout', 'Business-oriented design']
    },
    {
        title: 'Inventory Admin Panel',
        description: 'An internal admin dashboard to manage products, categories, and stock levels. Built with a focus on clarity, speed, and ease of use for non-technical users.',
        tags: ['Dashboard', 'Forms'],
        url: 'https://warningod.me/Hardware-Shop-Management-System/',
        details: ['Category management', 'Stock tracking concept', 'Scalable layout for future features']
    },
    {
        title: 'FitTrack Workout Tracker',
        description: 'Workout tracker website with a simple database layer for logging sessions and viewing history. Built for practical use and clean daily logging.',
        tags: ['UI', 'JS', 'DB'],
        url: 'https://warningod.me/FitTrack/',
        details: ['Workout logging', 'Basic database integration', 'Responsive, mobile-friendly UI']
    },
    {
        title: 'Nirvana Interiors',
        description: 'A modern web application showcasing high-end interior design services with dark luxury aesthetic. Features portfolio showcase, consultation booking system, and AI-powered form handling.',
        tags: ['React', 'TypeScript', 'Tailwind'],
        url: 'https://nirvanainteriors.studio/',
        details: ['React 19 with TypeScript', 'Framer Motion animations', 'Integrated booking system', 'SEO optimized']
    },
    {
        title: 'CentraCare - Childcare Management',
        description: 'A professional SaaS landing page for multi-location childcare management. Centralizes compliance, operations, and reporting across all daycare locations with multi-language support.',
        tags: ['React', 'TypeScript', 'Vite'],
        url: 'https://github.com/WarninGod/CentraCare---Multi-Site-Childcare-Management',
        details: ['Multi-language support (EN/NL/FR)', 'GDPR compliant', 'Component-based architecture', 'Responsive design']
    },
    {
        title: 'Little Sprout Academy',
        description: 'A modern childcare management website with parent portal, admin dashboard, and AI-powered parenting assistant. Features daily activity logs, real-time updates, and staff management.',
        tags: ['React', 'TypeScript', 'Gemini AI'],
        url: 'https://warningod.me/Little-Sprout-Academy/',
        details: ['Parent & Admin dashboards', 'AI parenting tips integration', 'Program management', 'Mobile-first design']
    }
];

// Main JavaScript functionality
class EsportsPortfolio {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.loadingScreen = document.getElementById('loading-screen');
        
        this.init();
    }
    
    init() {
        this.handleLoading();
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupFormHandling();
        this.setupAnimations();
        this.renderProjects();
        this.setupParallax();
    }
    
    // Loading screen animation
    handleLoading() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    this.loadingScreen.style.display = 'none';
                }, 500);
            }, 1500);
        });
    }
    
    // Navigation functionality
    setupNavigation() {
        // Mobile menu toggle
        this.navToggle.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.navToggle.classList.toggle('active');
        });
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    this.navMenu.classList.remove('active');
                    this.navToggle.classList.remove('active');
                }
            });
        });
        
        // Active navigation link highlighting
        this.updateActiveNavLink();
        window.addEventListener('scroll', () => this.updateActiveNavLink());
    }
    
    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Scroll effects
    setupScrollEffects() {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Navbar background on scroll
            if (scrollTop > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar on scroll
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                this.navbar.style.transform = 'translateY(-100%)';
            } else {
                this.navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });
    }
    
    // Parallax effects
    setupParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax-bg');
            
            parallaxElements.forEach(element => {
                const rate = scrolled * -0.5;
                element.style.transform = `translateY(${rate}px)`;
            });
        });
    }
    
    // Form handling
    setupFormHandling() {
        const contactForm = document.getElementById('contact-form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(contactForm);
                
                // Submit to Formspree
                await this.submitForm(contactForm, formData);
            });
        }
        
        // Floating label animation
        const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.value.trim() !== '') {
                    input.classList.add('has-value');
                } else {
                    input.classList.remove('has-value');
                }
            });
        });
    }
    
    async submitForm(form, formData) {
        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Get Formspree endpoint from config or environment
            const formspreeId = window.CONFIG?.FORMSPREE_ID || 'xreggnre';
            const formspreeUrl = `https://formspree.io/f/${formspreeId}`;
            
            // Submit to Formspree
            const response = await fetch(formspreeUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Show success message
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.background = 'linear-gradient(135deg, #4ecdc4, #26c6da)';
                
                // Reset form
                form.reset();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = 'var(--gradient-primary)';
                    submitBtn.disabled = false;
                }, 3000);
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            // Show error message
            submitBtn.innerHTML = '<i class="fas fa-times"></i> Error! Try again';
            submitBtn.style.background = 'linear-gradient(135deg, #ff6b6b, #ff5252)';
            
            console.error('Form submission error:', error);
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = 'var(--gradient-primary)';
                submitBtn.disabled = false;
            }, 3000);
        }
    }
    
    // Setup animations
    setupAnimations() {
        // Initialize AOS
        AOS.init({
            duration: 1000,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100
        });
        
        // Counter animation for stats
        this.animateCounters();
        
        // Typing effect for hero subtitle
        this.typewriterEffect();
    }
    
    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 200;
        
        const observerOptions = {
            threshold: 0.7,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.textContent.replace(/\D/g, '')) || 0;
                    
                    if (target > 0) {
                        const increment = target / speed;
                        let count = 0;
                        
                        const timer = setInterval(() => {
                            count += increment;
                            if (count >= target) {
                                counter.textContent = counter.textContent.replace(/\d+/, target);
                                clearInterval(timer);
                            } else {
                                counter.textContent = counter.textContent.replace(/\d+/, Math.ceil(count));
                            }
                        }, 10);
                    }
                    
                    observer.unobserve(counter);
                }
            });
        }, observerOptions);
        
        counters.forEach(counter => observer.observe(counter));
    }
    
    typewriterEffect() {
        const subtitle = document.querySelector('.hero-subtitle');
        if (!subtitle) return;
        
        const text = subtitle.textContent;
        subtitle.textContent = '';
        subtitle.style.opacity = '1';
        
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, 100);
    }

    // Render projects from PROJECTS array
    renderProjects() {
        const grid = document.getElementById('projects-grid');
        if (!grid) return;

        const makeTag = (t) => `<span class="project-tag">${t}</span>`;
        const cards = PROJECTS.map((p, idx) => {
            const url = p.url && p.url.trim() ? p.url.trim() : '';
            const delay = idx * 100;
            const action = url
                ? `<a href=\"${url}\" target=\"_blank\" rel=\"noopener\" class=\"project-button primary\" aria-label=\"Open ${p.title}\"><i class=\"fas fa-external-link-alt\" aria-hidden=\"true\"></i><span>Open</span></a>`
                : `<span class=\"project-button secondary\" aria-disabled=\"true\"><i class=\"fas fa-hourglass-half\" aria-hidden=\"true\"></i><span>Link coming soon</span></span>`;

            return `
                <div class="project-card" data-aos="zoom-in" data-aos-delay="${delay}">
                    <h3 class="project-title">${p.title}</h3>
                    <p class="project-desc">${p.description}</p>
                    <div class="project-tags">${(p.tags || []).map(makeTag).join('')}</div>
                    ${p.details && p.details.length ? `<ul class="project-details">${p.details.map(d => `<li>${d}</li>`).join('')}</ul>` : ''}
                    <div class="project-actions">${action}</div>
                </div>
            `;
        }).join('');

        grid.innerHTML = cards;
    }
}

// Utility functions
class Utils {
    static throttle(func, wait) {
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
    
    static debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }
    
    static isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

// Easter eggs and special effects
class EasterEggs {
    constructor() {
        this.konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
        this.userInput = [];
        this.setupKonamiCode();
        this.setupClickEffects();
    }
    
    setupKonamiCode() {
        document.addEventListener('keydown', (e) => {
            this.userInput.push(e.keyCode);
            
            if (this.userInput.length > this.konamiCode.length) {
                this.userInput.shift();
            }
            
            if (this.arraysEqual(this.userInput, this.konamiCode)) {
                this.activateEasterEgg();
            }
        });
    }
    
    setupClickEffects() {
        document.addEventListener('click', (e) => {
            this.createClickEffect(e.clientX, e.clientY);
        });
    }
    
    createClickEffect(x, y) {
        const effect = document.createElement('div');
        effect.style.position = 'fixed';
        effect.style.left = x + 'px';
        effect.style.top = y + 'px';
        effect.style.width = '10px';
        effect.style.height = '10px';
        effect.style.background = 'var(--primary-color)';
        effect.style.borderRadius = '50%';
        effect.style.pointerEvents = 'none';
        effect.style.animation = 'clickPulse 0.6s ease-out forwards';
        effect.style.zIndex = '9999';
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            document.body.removeChild(effect);
        }, 600);
    }
    
    activateEasterEgg() {
        // Rainbow mode
        document.body.style.filter = 'hue-rotate(0deg)';
        let hue = 0;
        
        const rainbow = setInterval(() => {
            hue += 10;
            document.body.style.filter = `hue-rotate(${hue}deg)`;
            
            if (hue >= 360) {
                clearInterval(rainbow);
                document.body.style.filter = 'none';
            }
        }, 100);
        
        // Show message
        this.showEasterEggMessage();
    }
    
    showEasterEggMessage() {
        const message = document.createElement('div');
        message.style.position = 'fixed';
        message.style.top = '50%';
        message.style.left = '50%';
        message.style.transform = 'translate(-50%, -50%)';
        message.style.background = 'var(--bg-dark)';
        message.style.color = 'var(--primary-color)';
        message.style.padding = '20px 40px';
        message.style.borderRadius = '10px';
        message.style.border = '2px solid var(--primary-color)';
        message.style.zIndex = '10000';
        message.style.fontFamily = 'var(--font-primary)';
        message.style.fontSize = '1.2rem';
        message.style.textAlign = 'center';
        message.innerHTML = '🎮 KONAMI CODE ACTIVATED! 🎮<br><small>Tushar Kajania approves!</small>';
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            document.body.removeChild(message);
        }, 3000);
    }
    
    arraysEqual(a, b) {
        return a.length === b.length && a.every((val, i) => val === b[i]);
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new EsportsPortfolio();
    new EasterEggs();
});

// Add CSS for click effect animation
const style = document.createElement('style');
style.textContent = `
    @keyframes clickPulse {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Floating Contact Widget Toggle
function initContactWidget() {
    const toggleBtn = document.getElementById('contact-widget-toggle');
    const popup = document.getElementById('contact-widget-popup');
    const closeIcon = toggleBtn.querySelector('.close-icon');
    const envelopeIcon = toggleBtn.querySelector('i');

    toggleBtn.addEventListener('click', () => {
        popup.classList.toggle('active');
        closeIcon.style.display = popup.classList.contains('active') ? 'block' : 'none';
        envelopeIcon.style.display = popup.classList.contains('active') ? 'none' : 'block';
    });

    // Close popup when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.floating-contact-widget')) {
            popup.classList.remove('active');
            closeIcon.style.display = 'none';
            envelopeIcon.style.display = 'block';
        }
    });
}

function closeContactWidget() {
    const popup = document.getElementById('contact-widget-popup');
    const toggleBtn = document.getElementById('contact-widget-toggle');
    const closeIcon = toggleBtn.querySelector('.close-icon');
    const envelopeIcon = toggleBtn.querySelector('i');
    
    popup.classList.remove('active');
    closeIcon.style.display = 'none';
    envelopeIcon.style.display = 'block';
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactWidget);
} else {
    initContactWidget();
}
