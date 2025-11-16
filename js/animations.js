// ========================================
// Simple & Smooth Animations
// ========================================

// ========================================
// Sticky Header on Scroll
// ========================================
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ========================================
// Smooth Scroll for Navigation
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// Mobile Menu Toggle
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }
});

// ========================================
// About Cards Animation on Scroll
// ========================================
const observeAboutCards = () => {
    const aboutCards = document.querySelectorAll('.about-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100); // Stagger effect
            }
        });
    }, {
        threshold: 0.2
    });
    
    aboutCards.forEach(card => {
        card.classList.add('fade-in-card');
        observer.observe(card);
    });
};

// ========================================
// Smooth Category Transition
// ========================================
const smoothCategoryTransition = () => {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const productsGrid = document.getElementById('productsGrid');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Add transition class
            if (productsGrid) {
                productsGrid.classList.add('transitioning');
                
                setTimeout(() => {
                    productsGrid.classList.remove('transitioning');
                }, 300);
            }
        });
    });
};

// ========================================
// Product Cards Fade In on Scroll
// ========================================
const observeProductCards = () => {
    const productCards = document.querySelectorAll('.product-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    
    productCards.forEach(card => {
        observer.observe(card);
    });
};

// ========================================
// Initialize All Animations
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎨 Animations initialized!');
    
    // Initialize animations
    observeAboutCards();
    smoothCategoryTransition();
    
    // Observe product cards after they're loaded
    setTimeout(() => {
        observeProductCards();
    }, 500);
});

// Re-observe product cards when category changes
document.addEventListener('DOMContentLoaded', function() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            setTimeout(() => {
                observeProductCards();
            }, 100);
        });
    });
});

// ========================================
// Active Navigation Link on Scroll
// ========================================
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
});
