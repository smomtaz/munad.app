// Smooth scrolling for navigation links
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

// Screenshot Carousel
let currentSlide = 0;
const slides = document.querySelectorAll('.screenshot-slide');
const dots = document.querySelectorAll('.dot');
const track = document.querySelector('.carousel-track');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');

function updateCarousel() {
    if (track) {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateCarousel();
}

// Button controls
if (nextBtn) nextBtn.addEventListener('click', nextSlide);
if (prevBtn) prevBtn.addEventListener('click', prevSlide);

// Dot controls
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        updateCarousel();
    });
});

// Auto-advance carousel
let autoSlideInterval = setInterval(nextSlide, 4000);

// Pause auto-advance on hover
const carousel = document.querySelector('.screenshot-carousel');
if (carousel) {
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(nextSlide, 4000);
    });
}

// Swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

if (carousel) {
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    });
}

function handleSwipeGesture() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }
}

// Navbar scroll effect
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

// Animate on scroll
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

// Install button functionality
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

// Show install instructions for different platforms
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

// Update prayer times in the phone mockup (demo)
function updatePrayerTimes() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // This is just for demo purposes
    const timeElement = document.querySelector('.time');
    if (timeElement) {
        timeElement.textContent = `${hours}:${minutes.toString().padStart(2, '0')}`;
    }
}

// Update time every minute
setInterval(updatePrayerTimes, 60000);
updatePrayerTimes();

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroPattern = document.querySelector('.hero-pattern');
    const carousel = document.querySelector('.screenshot-carousel');
    
    if (heroPattern) {
        heroPattern.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
    
    if (carousel && scrolled < window.innerHeight) {
        carousel.style.transform = `translateY(${-scrolled * 0.1}px)`;
    }
});

// Add interactive hover effect to feature cards
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

// Add smooth reveal animation for sections
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

// Add floating animation to decorative elements
function createFloatingAnimation() {
    const floatingElements = document.querySelectorAll('.feature-icon');
    
    floatingElements.forEach((el, index) => {
        el.style.animation = `float 3s ease-in-out ${index * 0.2}s infinite`;
    });
}

createFloatingAnimation();

// Simulate prayer time updates in the mockup
function simulatePrayerNotification() {
    const nextPrayer = document.querySelector('.next-prayer');
    
    if (nextPrayer) {
        setInterval(() => {
            nextPrayer.style.transform = 'scale(1.02)';
            setTimeout(() => {
                nextPrayer.style.transform = 'scale(1)';
            }, 300);
        }, 10000); // Pulse every 10 seconds
    }
}

simulatePrayerNotification();

// Add loading animation
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

// Easter egg: Konami code for special message
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

// Track scroll depth for analytics (privacy-friendly)
let maxScrollDepth = 0;
window.addEventListener('scroll', () => {
    const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    maxScrollDepth = Math.max(maxScrollDepth, scrollPercentage);
});

// Add touch gestures for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swiped left
            console.log('Swiped left');
        } else {
            // Swiped right
            console.log('Swiped right');
        }
    }
}

// Performance optimization: Lazy load images
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

console.log('%cMunad - مُناد', 'font-size: 24px; color: #0D7377; font-weight: bold;');
console.log('%cYour Call to Prayer', 'font-size: 14px; color: #D4AF37;');
console.log('%cMade with ❤️ for the Ummah', 'font-size: 12px; color: #666;');
