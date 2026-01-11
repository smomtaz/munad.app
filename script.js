// ==============================================
// SCREENSHOT CAROUSEL - Fixed Version
// ==============================================
// Wait for DOM to be fully loaded before initializing carousel
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing carousel...');
    
    // Screenshot Carousel in Phone Mockup
    let currentSlide = 0;
    const screenshots = document.querySelectorAll('.app-screenshot');
    const indicators = document.querySelectorAll('.indicator');
    let autoSlideInterval;

    console.log('Found screenshots:', screenshots.length);
    console.log('Found indicators:', indicators.length);

    function showSlide(index) {
        // Remove active class from all screenshots and indicators
        screenshots.forEach(screenshot => {
            screenshot.classList.remove('active');
        });
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Add active class to current slide and indicator
        if (screenshots[index]) {
            screenshots[index].classList.add('active');
            console.log('Showing screenshot', index + 1);
        }
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % screenshots.length;
        showSlide(currentSlide);
    }

    function previousSlide() {
        currentSlide = (currentSlide - 1 + screenshots.length) % screenshots.length;
        showSlide(currentSlide);
    }

    // Indicator click handlers
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            console.log('Clicked indicator', index + 1);
            currentSlide = index;
            showSlide(currentSlide);
            // Reset auto-advance timer
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(nextSlide, 4000);
        });
    });

    // Start auto-advance
    function startAutoSlide() {
        console.log('Starting auto-slide...');
        autoSlideInterval = setInterval(nextSlide, 4000); // Change every 4 seconds
    }

    // Pause on hover
    const phoneMockup = document.querySelector('.phone-mockup');
    if (phoneMockup) {
        phoneMockup.addEventListener('mouseenter', () => {
            console.log('Pausing carousel (mouse enter)');
            clearInterval(autoSlideInterval);
        });
        
        phoneMockup.addEventListener('mouseleave', () => {
            console.log('Resuming carousel (mouse leave)');
            startAutoSlide();
        });
    }

    // Initialize carousel
    if (screenshots.length > 0) {
        console.log('Initializing carousel with', screenshots.length, 'screenshots');
        showSlide(0);
        startAutoSlide();
    } else {
        console.error('ERROR: No screenshots found! Check image file names.');
    }

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    if (phoneMockup) {
        phoneMockup.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        phoneMockup.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swiped left - next slide
                console.log('Swiped left');
                nextSlide();
            } else {
                // Swiped right - previous slide
                console.log('Swiped right');
                previousSlide();
            }
            // Reset auto-advance
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(nextSlide, 4000);
        }
    }
});

// ==============================================
// SMOOTH SCROLLING
// ==============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==============================================
// NAVBAR SCROLL EFFECT
// ==============================================
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = '0 2px 20px rgba(13, 115, 119, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 30px rgba(13, 115, 119, 0.2)';
    }
    
    lastScroll = currentScroll;
});

// ==============================================
// ANIMATE ON SCROLL
// ==============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all elements with data-aos attribute
document.querySelectorAll('[data-aos]').forEach((el) => {
    observer.observe(el);
});

// Stagger animation delays
document.querySelectorAll('[data-aos-delay]').forEach((el, index) => {
    const delay = el.getAttribute('data-aos-delay');
    el.style.transitionDelay = `${delay}ms`;
});

// ==============================================
// PWA INSTALL BUTTON FUNCTIONALITY
// ==============================================
const installButtons = document.querySelectorAll('.btn-install');
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show PWA install option if available
    console.log('PWA install available');
});

installButtons.forEach(btn => {
    // For browsers that support PWA installation
    if (deferredPrompt) {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            if (deferredPrompt) {
                // Show the install prompt
                deferredPrompt.prompt();
                
                // Wait for the user to respond to the prompt
                const { outcome } = await deferredPrompt.userChoice;
                
                if (outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                
                // Clear the deferredPrompt
                deferredPrompt = null;
            }
        });
    }
    // Otherwise, the link will work normally and navigate to the app
});

// ==============================================
// SHOW INSTALL INSTRUCTIONS
// ==============================================
function showInstallInstructions() {
    const userAgent = navigator.userAgent.toLowerCase();
    let instructions = '';
    
    if (/iphone|ipad|ipod/.test(userAgent)) {
        instructions = 'To install on iOS:\n1. Tap the Share button\n2. Select "Add to Home Screen"\n3. Tap "Add"';
    } else if (/android/.test(userAgent)) {
        instructions = 'To install on Android:\n1. Tap the menu button (⋮)\n2. Select "Add to Home screen"\n3. Tap "Add"';
    } else {
        instructions = 'To install:\n1. Click the install icon in your browser\'s address bar\n2. Or use your browser\'s menu to add to home screen';
    }
    
    alert(instructions);
}

// ==============================================
// PARALLAX EFFECT
// ==============================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroPattern = document.querySelector('.hero-pattern');
    const phoneMockup = document.querySelector('.phone-mockup');
    
    if (heroPattern) {
        heroPattern.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
    
    if (phoneMockup && scrolled < window.innerHeight) {
        phoneMockup.style.transform = `translateY(${-scrolled * 0.15}px)`;
    }
});

// ==============================================
// INTERACTIVE HOVER EFFECT ON FEATURE CARDS
// ==============================================
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
    
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        this.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    });
});

// ==============================================
// REVEAL ANIMATION FOR SECTIONS
// ==============================================
const revealSections = document.querySelectorAll('section');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, {
    threshold: 0.15
});

revealSections.forEach(section => {
    revealObserver.observe(section);
});

// ==============================================
// FLOATING ANIMATION FOR ICONS
// ==============================================
function createFloatingAnimation() {
    const floatingElements = document.querySelectorAll('.feature-icon');
    
    floatingElements.forEach((el, index) => {
        el.style.animation = `float 3s ease-in-out ${index * 0.2}s infinite`;
    });
}

createFloatingAnimation();

// ==============================================
// PAGE LOAD ANIMATIONS
// ==============================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    setTimeout(() => {
        document.querySelectorAll('[data-aos]').forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 100);
});

// ==============================================
// EASTER EGG: KONAMI CODE
// ==============================================
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiPattern.join(',')) {
        showSpecialMessage();
    }
});

function showSpecialMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #0D7377 0%, #14FFEC 100%);
        color: white;
        padding: 30px 50px;
        border-radius: 20px;
        font-size: 24px;
        font-family: 'Amiri', serif;
        z-index: 10000;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: fadeInUp 0.5s ease;
    `;
    message.textContent = 'بارك الله فيك - May Allah bless you!';
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.opacity = '0';
        message.style.transform = 'translate(-50%, -50%) scale(0.8)';
        setTimeout(() => message.remove(), 500);
    }, 3000);
}

// ==============================================
// LAZY LOAD IMAGES
// ==============================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==============================================
// CONSOLE BRANDING
// ==============================================
console.log('%cMunad - مُناد', 'font-size: 24px; color: #0D7377; font-weight: bold;');
console.log('%cYour Call to Prayer', 'font-size: 14px; color: #D4AF37;');
console.log('%cMade with ❤️ for the Ummah', 'font-size: 12px; color: #666;');
