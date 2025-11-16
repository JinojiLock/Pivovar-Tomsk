/**
 * Age Verification Modal Handler
 * Проверка возраста 18+ для доступа к сайту
 * Соответствует ФЗ-171 и ФЗ-436
 */

(function() {
    'use strict';
    
    // Ключ для хранения в localStorage
    const AGE_VERIFIED_KEY = 'pivovar_age_verified';
    
    // Инициализация при загрузке DOM
    document.addEventListener('DOMContentLoaded', function() {
        checkAgeVerification();
    });
    
    /**
     * Проверка подтверждения возраста
     */
    function checkAgeVerification() {
        const isVerified = localStorage.getItem(AGE_VERIFIED_KEY);
        
        // Если пользователь уже подтвердил возраст, не показываем модальное окно
        if (isVerified === 'true') {
            return;
        }
        
        // Показываем модальное окно
        showAgeModal();
    }
    
    /**
     * Показать модальное окно подтверждения возраста
     */
    function showAgeModal() {
        const modal = document.getElementById('ageModal');
        
        if (!modal) {
            console.error('Age verification modal not found');
            return;
        }
        
        // Показываем модальное окно
        modal.classList.add('active');
        
        // Блокируем прокрутку страницы
        document.body.style.overflow = 'hidden';
        
        // Обработчики кнопок
        const btnYes = document.getElementById('ageConfirmYes');
        const btnNo = document.getElementById('ageConfirmNo');
        
        if (btnYes) {
            btnYes.addEventListener('click', handleAgeConfirmYes);
        }
        
        if (btnNo) {
            btnNo.addEventListener('click', handleAgeConfirmNo);
        }
    }
    
    /**
     * Обработка подтверждения "Да, мне есть 18"
     */
    function handleAgeConfirmYes() {
        // Сохраняем подтверждение в localStorage (действует до очистки браузера)
        localStorage.setItem(AGE_VERIFIED_KEY, 'true');
        
        // Закрываем модальное окно
        closeAgeModal();
        
        // Аналитика (опционально)
        if (typeof ym !== 'undefined') {
            ym(window.yaCounterId, 'reachGoal', 'age_verified_yes');
        }
    }
    
    /**
     * Обработка отказа "Нет, мне нет 18"
     */
    function handleAgeConfirmNo() {
        // Показываем сообщение
        showUnderageMessage();
        
        // Аналитика (опционально)
        if (typeof ym !== 'undefined') {
            ym(window.yaCounterId, 'reachGoal', 'age_verified_no');
        }
        
        // Через 3 секунды перенаправляем на Яндекс
        setTimeout(function() {
            window.location.href = 'https://ya.ru';
        }, 3000);
    }
    
    /**
     * Закрыть модальное окно
     */
    function closeAgeModal() {
        const modal = document.getElementById('ageModal');
        
        if (modal) {
            modal.classList.remove('active');
            
            // Разблокируем прокрутку
            document.body.style.overflow = '';
        }
    }
    
    /**
     * Показать сообщение для несовершеннолетних
     */
    function showUnderageMessage() {
        const modalContent = document.querySelector('.age-modal-content');
        
        if (modalContent) {
            modalContent.innerHTML = `
                <div class="age-modal-icon" style="color: #ff4444;">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h2 style="color: #ff4444;">Доступ ограничен</h2>
                <p class="age-modal-text">
                    К сожалению, данный сайт содержит информацию об алкогольной продукции 
                    и доступен только лицам, достигшим 18 лет.
                </p>
                <p class="age-modal-text" style="margin-top: 1rem;">
                    Вы будете перенаправлены на главную страницу Яндекса через 3 секунды...
                </p>
                <div style="margin-top: 2rem;">
                    <div class="spinner" style="
                        border: 4px solid rgba(212, 165, 116, 0.2);
                        border-top: 4px solid var(--color-amber);
                        border-radius: 50%;
                        width: 40px;
                        height: 40px;
                        animation: spin 1s linear infinite;
                        margin: 0 auto;
                    "></div>
                </div>
            `;
            
            // Добавляем анимацию спиннера если её нет
            if (!document.getElementById('spinnerStyle')) {
                const style = document.createElement('style');
                style.id = 'spinnerStyle';
                style.textContent = `
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }
    
    /**
     * Очистить подтверждение возраста (для тестирования)
     * Вызов в консоли: clearAgeVerification()
     */
    window.clearAgeVerification = function() {
        localStorage.removeItem(AGE_VERIFIED_KEY);
        console.log('Age verification cleared. Reload page to see modal again.');
    };
    
})();
