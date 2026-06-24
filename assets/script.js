/* ============================================
   E³ — MAIN SCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    'use strict';
    
    // ============================================
    // PRELOADER
    // ============================================
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                preloader.classList.add('hidden');
            }, 1200);
        });
    }
    
    // ============================================
    // NAVBAR SCROLL
    // ============================================
    const navbar = document.getElementById('navbar');
    if (navbar) {
        let lastScroll = 0;
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            lastScroll = currentScroll;
        });
    }
    
    // ============================================
    // MOBILE NAV
    // ============================================
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('open');
            mobileNav.classList.toggle('open');
            document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
        });
        
        // Close on link click
        mobileNav.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                hamburger.classList.remove('open');
                mobileNav.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }
    
    // ============================================
    // SCROLL REVEAL (Intersection Observer)
    // ============================================
    const revealElements = document.querySelectorAll(
        '.section-header, .problem-card, .eco-layer, .solution-card, .process-step, .vision-content, .cta-content'
    );
    
    if (revealElements.length) {
        const revealObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(function(el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1), transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
            revealObserver.observe(el);
        });
    }
    
    // ============================================
    // COUNTER ANIMATION
    // ============================================
    const counters = document.querySelectorAll('.counter');
    let countersAnimated = false;
    
    if (counters.length) {
        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting && !countersAnimated) {
                    countersAnimated = true;
                    counters.forEach(function(counter) {
                        const target = parseInt(counter.getAttribute('data-target'));
                        let current = 0;
                        const increment = target / 45;
                        const timer = setInterval(function() {
                            current += increment;
                            if (current >= target) {
                                counter.textContent = target;
                                clearInterval(timer);
                            } else {
                                counter.textContent = Math.floor(current);
                            }
                        }, 30);
                    });
                }
            });
        }, { threshold: 0.5 });
        
        const statsSection = document.querySelector('.hero-stats');
        if (statsSection) {
            counterObserver.observe(statsSection);
        }
    }
    
    // ============================================
    // PROBLEM BAR ANIMATION
    // ============================================
    const problemFills = document.querySelectorAll('.problem-fill');
    
    if (problemFills.length) {
        const barObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const fill = entry.target;
                    const width = fill.getAttribute('data-width');
                    setTimeout(function() {
                        fill.style.setProperty('--target-width', width + '%');
                        fill.classList.add('animated');
                    }, 300);
                }
            });
        }, { threshold: 0.3 });
        
        problemFills.forEach(function(fill) {
            barObserver.observe(fill);
        });
    }
    
    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = document.getElementById('navbar') ? 
                    document.getElementById('navbar').offsetHeight : 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ============================================
    // ACTIVE NAV LINK (based on current page)
    // ============================================
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-nav-inner a').forEach(function(link) {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath || (currentPath === 'index.html' && linkPath === 'index.html')) {
            link.classList.add('active');
        }
    });
    
    // ============================================
    // PARALLAX EFFECT ON HERO (optional)
    // ============================================
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const heroBg = hero.querySelector('.hero-bg');
            if (heroBg && scrolled < window.innerHeight) {
                heroBg.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
            }
        });
    }
    
    console.log('✦ E³ — Encouraging Excellence Early');
    console.log('◆ Luxury Design System 2026');
    console.log('◈ Built with precision and elegance');
    
});
// ============================================
// CATEGORY FILTER
// ============================================
const categoryBtns = document.querySelectorAll('.category-btn');
const articleCards = document.querySelectorAll('.article-card');

if (categoryBtns.length && articleCards.length) {
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            // Filter articles
            articleCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// ============================================
// NEWSLETTER FORM
// ============================================
function handleNewsletter(event) {
    event.preventDefault();
    const email = document.getElementById('newsletterEmail');
    const success = document.getElementById('newsletterSuccess');
    
    if (email && email.value.trim()) {
        // Simulate submission
        success.classList.add('show');
        email.value = '';
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            success.classList.remove('show');
        }, 5000);
        
        console.log('Newsletter subscription: ' + email.value);
    }
}

// ============================================
// ARTICLE READ MORE (for demo)
// ============================================
document.querySelectorAll('.article-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const card = this.closest('.article-card');
        const title = card ? card.querySelector('h3')?.textContent || 'Article' : 'Article';
        alert(`"${title}" — Full article coming soon. Stay tuned for insights from E³!`);
    });
});
// ============================================
// CONTACT FORM HANDLING
// ============================================
function handleContactForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('contactName');
    const email = document.getElementById('contactEmail');
    const message = document.getElementById('contactMessage');
    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    
    // Validate required fields
    if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        alert('Please fill in all required fields (Name, Email, and Message).');
        return;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
        alert('Please enter a valid email address.');
        return;
    }
    
    // Hide form, show success
    form.style.display = 'none';
    success.classList.add('show');
    
    // Log submission (in production, this would send to a server)
    console.log('Contact Form Submission:', {
        name: name.value.trim(),
        email: email.value.trim(),
        phone: document.getElementById('contactPhone').value.trim(),
        service: document.getElementById('contactService').value,
        message: message.value.trim()
    });
    
    // Optional: Send to WhatsApp as fallback
    const waMessage = `Hi E³ SME, I'm ${name.value.trim()}. ${message.value.trim()}`;
    const waUrl = `https://wa.me/2347042776167?text=${encodeURIComponent(waMessage)}`;
    
    // Add WhatsApp link to success message
    const waLink = success.querySelector('.success-wa a');
    if (waLink) {
        waLink.href = waUrl;
    }
}

// ============================================
// SMOOTH SCROLL TO CONTACT FORM
// ============================================
document.querySelectorAll('a[href="#contactForm"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const form = document.getElementById('contactForm');
        if (form) {
            const navHeight = document.getElementById('navbar') ? 
                document.getElementById('navbar').offsetHeight : 80;
            const targetPosition = form.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            // Focus on first input
            const firstInput = form.querySelector('input');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 800);
            }
        }
    });
});

console.log('✦ E³ — Contact Page Loaded');
console.log('◆ Ready to build something exceptional');
