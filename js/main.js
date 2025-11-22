// ========================================
// Global Variables
// ========================================

let drinksData = [];
let currentCategory = 'beer'; // Изначально показываем пиво

// Category names translation
const categoryNames = {
    'beer': 'Разливное пиво',
    'cider': 'Сидр',
    'lemonade': 'Лимонады',
    'drinks': 'Напитки',
    'nuts': 'Орешки',
    'fish': 'Рыба',
    'crackers': 'Сухарики',
    'frozen foods': 'Замороженные продукты'
};

// ========================================
// Mobile Menu Toggle
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.addClassList.toggle('active');
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
// Smooth Scrolling for Navigation
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

// ========================================
// Load Drinks from Static JSON
// ========================================

async function loadDrinks() {
    try {
        const response = await fetch('data/drinks-updated.json');
        const result = await response.json();
        drinksData = result.drinks || [];
        displayDrinks(currentCategory);
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
        displayErrorMessage();
    }
}

// ========================================
// Display Drinks in Catalog
// ========================================

let itemsToShow = 12; // Initially show 12 items
let showingAll = false;

function displayDrinks(category) {
    const productsGrid = document.getElementById('productsGrid');
    
    if (!productsGrid) return;
    
    // Filter drinks by category
    let filteredDrinks;
    
    if (category === 'all') {
        filteredDrinks = drinksData;
    } else if (category === 'on-sale') {
        // Фильтр по акциям (onSale === true)
        filteredDrinks = drinksData.filter(drink => drink.onSale === true);
    } else if (category === 'coming-soon') {
        // Фильтр по "Скоро в продаже" (comingSoon === true)
        filteredDrinks = drinksData.filter(drink => drink.comingSoon === true);
    } else {
        // Обычная фильтрация по категории
        filteredDrinks = drinksData.filter(drink => drink.category === category);
    }
    
    // Clear grid
    productsGrid.innerHTML = '';
    
    // Check if no drinks found
    if (filteredDrinks.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 2rem; color: #a0a0a0;">Товары не найдены</p>';
        return;
    }
    
    // Determine how many items to display
    const itemsCount = showingAll ? filteredDrinks.length : Math.min(itemsToShow, filteredDrinks.length);
    
    // Create product cards
    filteredDrinks.slice(0, itemsCount).forEach((drink, index) => {
        const card = createProductCard(drink);
        productsGrid.appendChild(card);
        
        // Add visible class with slight delay for animation
        setTimeout(() => {
            card.classList.add('visible');
        }, index * 50);
    });
    
    // Add "Show More" button if there are more items
    if (filteredDrinks.length > itemsToShow && !showingAll) {
        const showMoreBtn = document.createElement('div');
        showMoreBtn.className = 'show-more-container';
        showMoreBtn.innerHTML = `
            <button class="btn btn-primary btn-show-more" id="showMoreBtn">
                Показать все товары (${filteredDrinks.length})
                <i class="fas fa-chevron-down"></i>
            </button>
        `;
        productsGrid.appendChild(showMoreBtn);
        
        // Add click handler
        document.getElementById('showMoreBtn').addEventListener('click', function() {
            showingAll = true;
            displayDrinks(category);
            // Smooth scroll to continue viewing
            this.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }
    
    // Add "Show Less" button if showing all
    if (showingAll && filteredDrinks.length > itemsToShow) {
        const showLessBtn = document.createElement('div');
        showLessBtn.className = 'show-more-container';
        showLessBtn.innerHTML = `
            <button class="btn btn-secondary btn-show-more" id="showLessBtn">
                Показать меньше
                <i class="fas fa-chevron-up"></i>
            </button>
        `;
        productsGrid.appendChild(showLessBtn);
        
        // Add click handler
        document.getElementById('showLessBtn').addEventListener('click', function() {
            showingAll = false;
            displayDrinks(category);
            // Scroll to catalog top
            document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
        });
    }
}

// ========================================
// Create Product Card Element
// ========================================

function createProductCard(drink) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-category', drink.category);
    
    // Add sale class if product is on sale
    if (drink.onSale) {
        card.classList.add('on-sale');
    }
    
    const icon = drink.icon || 'fa-beer-mug-empty';
    const categoryName = categoryNames[drink.category] || drink.category;
    
    // Format price with sale support
    let priceHTML;
    if (drink.onSale && drink.oldPrice) {
        const unit = drink.unit ? `/${drink.unit}` : '';
        priceHTML = `
            <div class="price-wrapper">
                <span class="old-price">${drink.oldPrice} ₽${unit}</span>
                <span class="new-price">${drink.price} ₽${unit}</span>
                ${drink.salePercent ? `<span class="sale-percent">-${drink.salePercent}%</span>` : ''}
            </div>
        `;
    } else {
        priceHTML = drink.unit ? `${drink.price} ₽/${drink.unit}` : `${drink.price} ₽`;
    }
    
    // Check if this is beer with detailed info
    const hasDetails = drink.category === 'beer' && (drink.taste || drink.abv || drink.malt);
    
    if (hasDetails) {
        // Create FLIP card for beer with details
        card.classList.add('has-details');
        
        // Sale badge
        const saleBadge = drink.onSale ? '<div class="sale-badge">АКЦИЯ</div>' : '';
        
        card.innerHTML = `
            <div class="product-card-inner">
                <!-- FRONT SIDE -->
                <div class="product-card-front">
                    ${saleBadge}
                    ${drink.image ? `
                    <div class="product-image">
                        <img src="${drink.image}" alt="${drink.name}" loading="lazy">
                        <div class="image-disclaimer">Вариант сервировки</div>
                    </div>
                    ` : `
                    <div class="product-icon">
                        <i class="fas ${icon}"></i>
                    </div>
                    `}
                    <div class="product-info">
                        <div class="product-category">${categoryName}</div>
                        <h3 class="product-name">${drink.name}</h3>
                        ${drink.country ? `<div class="product-country">${drink.country}</div>` : ''}
                        <p class="product-description">${drink.description || ''}</p>
                        <div class="product-price">${priceHTML}</div>
                    </div>
                    <div class="flip-hint">
                        <i class="fas fa-info-circle"></i>
                        Подробнее
                    </div>
                </div>
                
                <!-- BACK SIDE -->
                <div class="product-card-back">
                    <div class="product-details">
                        <div class="product-details-header">
                            <h3>${drink.name}</h3>
                            ${drink.country ? `<span class="country-badge">${drink.country}</span>` : ''}
                        </div>
                        
                        <div class="product-details-body">
                            ${drink.abv ? `
                                <div class="detail-row">
                                    <i class="fas fa-percent"></i>
                                    <span class="detail-label">Крепость:</span>
                                    <span class="detail-value">${drink.abv}</span>
                                </div>
                            ` : ''}
                            
                            ${drink.ibu ? `
                                <div class="detail-row">
                                    <i class="fas fa-chart-line"></i>
                                    <span class="detail-label">Горечь:</span>
                                    <span class="detail-value">${drink.ibu} IBU</span>
                                </div>
                            ` : ''}
                            
                            ${drink.plato ? `
                                <div class="detail-row">
                                    <i class="fas fa-tint"></i>
                                    <span class="detail-label">Плотность:</span>
                                    <span class="detail-value">${drink.plato} °P</span>
                                </div>
                            ` : ''}
                            
                            ${drink.color ? `
                                <div class="detail-row">
                                    <i class="fas fa-palette"></i>
                                    <span class="detail-label">Цвет:</span>
                                    <span class="detail-value">${drink.color}</span>
                                </div>
                            ` : ''}
                            
                            ${drink.malt ? `
                                <div class="detail-row">
                                    <i class="fas fa-wheat-awn"></i>
                                    <span class="detail-label">Солод:</span>
                                    <span class="detail-value">${drink.malt}</span>
                                </div>
                            ` : ''}
                            
                            ${drink.hops ? `
                                <div class="detail-row">
                                    <i class="fas fa-leaf"></i>
                                    <span class="detail-label">Хмель:</span>
                                    <span class="detail-value">${drink.hops}</span>
                                </div>
                            ` : ''}
                            
                            ${drink.taste ? `
                                <div class="taste-description">
                                    <div class="detail-row">
                                        <i class="fas fa-comment-dots"></i>
                                        <strong>Описание вкуса:</strong>
                                    </div>
                                    <p>${drink.taste}</p>
                                </div>
                            ` : ''}
                            
                            ${drink.pairsWith ? `
                                <div class="detail-row">
                                    <i class="fas fa-utensils"></i>
                                    <span class="detail-label">Сочетается:</span>
                                    <span class="detail-value">${drink.pairsWith}</span>
                                </div>
                            ` : ''}
                            
                            ${drink.servingTemp ? `
                                <div class="detail-row">
                                    <i class="fas fa-temperature-half"></i>
                                    <span class="detail-label">Подавать:</span>
                                    <span class="detail-value">${drink.servingTemp}</span>
                                </div>
                            ` : ''}
                        </div>
                        
                        <div class="product-details-footer">
                            <div class="price-on-back">${priceHTML}</div>
                            <button class="flip-back-btn">
                                <i class="fas fa-arrow-left"></i>
                                Назад
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add flip functionality
        card.addEventListener('click', function(e) {
            // Don't flip if clicking the back button
            if (e.target.closest('.flip-back-btn')) {
                e.stopPropagation();
                this.classList.remove('flipped');
            } else if (!this.classList.contains('flipped')) {
                this.classList.add('flipped');
            }
        });
        
    } else {
        // Regular card for non-beer or beer without details
        const countryBadge = drink.country ? `<div class="product-country">${drink.country}</div>` : '';
        const saleBadge = drink.onSale ? '<div class="sale-badge">АКЦИЯ</div>' : '';
        
        card.innerHTML = `
            ${saleBadge}
            ${drink.image ? `
            <div class="product-image">
                <img src="${drink.image}" alt="${drink.name}" loading="lazy">
                <div class="image-disclaimer">Вариант сервировки</div>
            </div>
            ` : `
            <div class="product-icon">
                <i class="fas ${icon}"></i>
            </div>
            `}
            <div class="product-info">
                <div class="product-category">${categoryName}</div>
                <h3 class="product-name">${drink.name}</h3>
                ${countryBadge}
                <p class="product-description">${drink.description || ''}</p>
                <div class="product-price">${priceHTML}</div>
            </div>
        `;
    }
    
    return card;
}

// ========================================
// Display Error Message
// ========================================

function displayErrorMessage() {
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
        productsGrid.innerHTML = `
            <p style="text-align: center; grid-column: 1/-1; padding: 2rem; color: #a0a0a0;">
                Ошибка загрузки каталога. Пожалуйста, обновите страницу.
            </p>
        `;
    }
}

// ========================================
// Category Filter Functionality
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get selected category
            currentCategory = this.getAttribute('data-category');
            
            // Reset show all state when changing category
            showingAll = false;
            
            // Display filtered drinks
            displayDrinks(currentCategory);
        });
    });
    
    // Load drinks on page load
    loadDrinks();
});

// ========================================
// Phone Number Formatting
// ========================================

function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 0) {
        if (value[0] === '8') {
            value = '7' + value.slice(1);
        }
        if (value[0] !== '7') {
            value = '7' + value;
        }
    }
    
    let formatted = '+7';
    if (value.length > 1) {
        formatted += ' (' + value.substring(1, 4);
    }
    if (value.length >= 5) {
        formatted += ') ' + value.substring(4, 7);
    }
    if (value.length >= 8) {
        formatted += '-' + value.substring(7, 9);
    }
    if (value.length >= 10) {
        formatted += '-' + value.substring(9, 11);
    }
    
    input.value = formatted;
}

document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('customerPhone');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
        
        phoneInput.addEventListener('focus', function() {
            if (this.value === '') {
                this.value = '+7 (';
            }
        });
    }
});

// ========================================
// Set Minimum Pickup Time (Current Time + 1 hour)
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const pickupTimeInput = document.getElementById('pickupTime');
    
    if (pickupTimeInput) {
        const now = new Date();
        now.setHours(now.getHours() + 1);
        
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        const minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
        pickupTimeInput.min = minDateTime;
        pickupTimeInput.value = minDateTime;
    }
});

// ========================================
// Preorder Form Submission
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const preorderForm = document.getElementById('preorderForm');
    const successMessage = document.getElementById('successMessage');
    
    if (preorderForm) {
        preorderForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                customerName: document.getElementById('customerName').value.trim(),
                customerPhone: document.getElementById('customerPhone').value.trim(),
                drinkCategory: document.getElementById('drinkCategory').value,
                drinkName: document.getElementById('drinkName').value.trim(),
                quantity: parseFloat(document.getElementById('quantity').value),
                pickupTime: new Date(document.getElementById('pickupTime').value).getTime(),
                comment: document.getElementById('comment').value.trim(),
                status: 'pending'
            };
            
            // Validate phone number
            const phoneDigits = formData.customerPhone.replace(/\D/g, '');
            if (phoneDigits.length !== 11) {
                alert('Пожалуйста, введите корректный номер телефона');
                return;
            }
            
            try {
                // Submit preorder to database
                const response = await fetch('tables/preorders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    // Show success message
                    successMessage.classList.add('show');
                    
                    // Reset form
                    preorderForm.reset();
                    
                    // Reset pickup time to default
                    const now = new Date();
                    now.setHours(now.getHours() + 1);
                    const year = now.getFullYear();
                    const month = String(now.getMonth() + 1).padStart(2, '0');
                    const day = String(now.getDate()).padStart(2, '0');
                    const hours = String(now.getHours()).padStart(2, '0');
                    const minutes = String(now.getMinutes()).padStart(2, '0');
                    document.getElementById('pickupTime').value = `${year}-${month}-${day}T${hours}:${minutes}`;
                    
                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        successMessage.classList.remove('show');
                    }, 5000);
                    
                    // Scroll to success message
                    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    throw new Error('Ошибка отправки заказа');
                }
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Произошла ошибка при отправке заказа. Пожалуйста, попробуйте позже или позвоните нам.');
            }
        });
    }
});

// ========================================
// Initialize Map (Yandex Maps)
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const mapContainer = document.getElementById('map');
    
    if (mapContainer) {
        // Create embedded Yandex Map
        const latitude = 56.518000;
        const longitude = 85.034200;
        const mapUrl = `https://yandex.ru/map-widget/v1/?ll=${longitude}%2C${latitude}&z=16&pt=${longitude}%2C${latitude}`;
        
        mapContainer.innerHTML = `
            <iframe 
                src="${mapUrl}" 
                width="100%" 
                height="400" 
                frameborder="0" 
                style="border: none;"
                allowfullscreen="true">
            </iframe>
        `;
    }
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


