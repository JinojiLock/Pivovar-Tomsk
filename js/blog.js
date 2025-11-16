// ========================================
// Blog Articles Loader and Renderer
// ========================================

let blogArticles = [];

// ========================================
// Load Blog Articles from JSON
// ========================================

async function loadBlogArticles() {
    try {
        const response = await fetch('data/blog-articles.json');
        if (!response.ok) throw new Error('Failed to load blog articles');
        const data = await response.json();
        blogArticles = data.articles || [];
        renderBlogGrid(blogArticles);
    } catch (error) {
        console.error('Error loading blog articles:', error);
        displayBlogError();
    }
}

// ========================================
// Render Blog Grid
// ========================================

function renderBlogGrid(articles) {
    const blogGrid = document.getElementById('blogGrid');
    
    if (!blogGrid) return;
    
    // Clear grid
    blogGrid.innerHTML = '';
    
    // Check if no articles found
    if (articles.length === 0) {
        blogGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 2rem; color: #a0a0a0;">Статьи не найдены</p>';
        return;
    }
    
    // Create article cards
    articles.forEach((article, index) => {
        const card = createBlogCard(article);
        blogGrid.appendChild(card);
        
        // Add visible class with slight delay for animation
        setTimeout(() => {
            card.classList.add('visible');
        }, index * 100);
    });
}

// ========================================
// Create Blog Card Element
// ========================================

function createBlogCard(article) {
    const card = document.createElement('div');
    card.className = 'blog-card';
    card.setAttribute('data-category', article.category);
    
    // Format publish date
    const publishDate = new Date(article.publishDate);
    const formattedDate = publishDate.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });
    
    card.innerHTML = `
        <div class="blog-card-image">
            <img src="${article.image}" alt="${article.title}" loading="lazy">
            <div class="blog-card-category">
                <i class="fas ${article.icon}"></i>
                ${article.category}
            </div>
        </div>
        <div class="blog-card-content">
            <div class="blog-card-meta">
                <span class="blog-card-date">
                    <i class="far fa-calendar"></i>
                    ${formattedDate}
                </span>
                <span class="blog-card-read-time">
                    <i class="far fa-clock"></i>
                    ${article.readTime}
                </span>
            </div>
            <h3 class="blog-card-title">${article.title}</h3>
            <p class="blog-card-excerpt">${article.excerpt}</p>
            <button class="blog-card-btn" data-article-id="${article.id}">
                Читать статью
                <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    `;
    
    // Add click handler for "Read Article" button
    const readBtn = card.querySelector('.blog-card-btn');
    readBtn.addEventListener('click', function() {
        showArticleModal(article);
    });
    
    return card;
}

// ========================================
// Display Blog Error Message
// ========================================

function displayBlogError() {
    const blogGrid = document.getElementById('blogGrid');
    if (blogGrid) {
        blogGrid.innerHTML = `
            <p style="text-align: center; grid-column: 1/-1; padding: 2rem; color: #a0a0a0;">
                Ошибка загрузки статей. Пожалуйста, обновите страницу.
            </p>
        `;
    }
}

// ========================================
// Show Article Modal
// ========================================

function showArticleModal(article) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('articleModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'articleModal';
        modal.className = 'article-modal';
        document.body.appendChild(modal);
    }
    
    // Format publish date
    const publishDate = new Date(article.publishDate);
    const formattedDate = publishDate.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });
    
    // Render article content
    let contentHTML = '';
    article.content.forEach(block => {
        switch(block.type) {
            case 'paragraph':
                contentHTML += `<p class="article-paragraph">${block.text}</p>`;
                break;
            case 'heading':
                contentHTML += `<h3 class="article-heading">${block.text}</h3>`;
                break;
            case 'list':
                contentHTML += `<ul class="article-list">`;
                block.items.forEach(item => {
                    contentHTML += `<li>${item}</li>`;
                });
                contentHTML += `</ul>`;
                break;
            case 'tip':
                contentHTML += `<div class="article-tip">${block.text}</div>`;
                break;
        }
    });
    
    modal.innerHTML = `
        <div class="article-modal-overlay"></div>
        <div class="article-modal-content">
            <button class="article-modal-close">
                <i class="fas fa-times"></i>
            </button>
            
            <div class="article-modal-header">
                <div class="article-modal-image">
                    <img src="${article.image}" alt="${article.title}">
                </div>
                <div class="article-modal-header-content">
                    <div class="article-modal-category">
                        <i class="fas ${article.icon}"></i>
                        ${article.category}
                    </div>
                    <h2 class="article-modal-title">${article.title}</h2>
                    <div class="article-modal-meta">
                        <span>
                            <i class="far fa-calendar"></i>
                            ${formattedDate}
                        </span>
                        <span>
                            <i class="far fa-clock"></i>
                            ${article.readTime}
                        </span>
                    </div>
                </div>
            </div>
            
            <div class="article-modal-body">
                ${contentHTML}
            </div>
            
            <div class="article-modal-footer">
                <p><strong>Приходите в магазин «Пивовар»</strong> и попробуйте разные сорта пива, чтобы применить эти знания на практике!</p>
                <a href="#catalog" class="btn btn-primary article-modal-catalog-btn">
                    <i class="fas fa-beer-mug-empty"></i>
                    Смотреть каталог
                </a>
            </div>
        </div>
    `;
    
    // Show modal with animation
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent body scroll
    
    // Close button handler
    const closeBtn = modal.querySelector('.article-modal-close');
    const overlay = modal.querySelector('.article-modal-overlay');
    
    closeBtn.addEventListener('click', closeArticleModal);
    overlay.addEventListener('click', closeArticleModal);
    
    // Catalog button handler
    const catalogBtn = modal.querySelector('.article-modal-catalog-btn');
    catalogBtn.addEventListener('click', function() {
        closeArticleModal();
        // Smooth scroll to catalog
        document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
    });
    
    // ESC key to close
    document.addEventListener('keydown', handleEscapeKey);
}

// ========================================
// Close Article Modal
// ========================================

function closeArticleModal() {
    const modal = document.getElementById('articleModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore body scroll
        
        // Remove modal after animation
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
    
    // Remove ESC key handler
    document.removeEventListener('keydown', handleEscapeKey);
}

// ========================================
// Handle ESC Key
// ========================================

function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        closeArticleModal();
    }
}

// ========================================
// Initialize Blog on Page Load
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    loadBlogArticles();
});
