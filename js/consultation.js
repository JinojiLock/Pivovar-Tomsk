// ============================================
// КОНФИГУРАЦИЯ TELEGRAM BOT
// ============================================

const PIPEDREAM_WEBHOOK_URL = 'https://eovh945875qpmjc.m.pipedream.net';

// ============================================
// ВАЛИДАЦИЯ ФОРМЫ
// ============================================

/**
 * Валидация имени (2-50 символов, только буквы и пробелы)
 */
function validateName(name) {
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
        return { valid: false, message: 'Имя должно содержать минимум 2 символа' };
    }
    if (trimmedName.length > 50) {
        return { valid: false, message: 'Имя должно содержать максимум 50 символов' };
    }
    // Проверка на наличие букв (кириллица или латиница)
    const nameRegex = /^[а-яА-ЯёЁa-zA-Z\s-]+$/;
    if (!nameRegex.test(trimmedName)) {
        return { valid: false, message: 'Имя должно содержать только буквы' };
    }
    return { valid: true, message: '' };
}

/**
 * Валидация телефона (российский формат)
 */
function validatePhone(phone) {
    // Убираем все нецифровые символы
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Проверяем длину (строго 11 цифр для российских номеров)
    if (cleanPhone.length < 11) {
        return { valid: false, message: 'Номер телефона должен содержать 11 цифр' };
    }
    if (cleanPhone.length > 11) {
        return { valid: false, message: 'Номер телефона слишком длинный' };
    }
    
    // Проверяем формат (должен начинаться с 7 или 8 для России)
    if (!cleanPhone.startsWith('7') && !cleanPhone.startsWith('8')) {
        return { valid: false, message: 'Номер должен начинаться с 7 или 8' };
    }
    
    return { valid: true, message: '', cleanPhone };
}

/**
 * Валидация сообщения (10-500 символов)
 */
function validateMessage(message) {
    const trimmedMessage = message.trim();
    if (trimmedMessage.length < 10) {
        return { valid: false, message: 'Сообщение должно содержать минимум 10 символов' };
    }
    if (trimmedMessage.length > 500) {
        return { valid: false, message: 'Сообщение должно содержать максимум 500 символов' };
    }
    return { valid: true, message: '' };
}

/**
 * Форматирование телефона в красивый вид +7 (XXX) XXX-XX-XX
 */
function formatPhone(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    let formatted = cleanPhone;
    
    if (cleanPhone.length === 11) {
        // Если начинается с 7 или 8, преобразуем в формат +7 (XXX) XXX-XX-XX
        formatted = `+7 (${cleanPhone.slice(1, 4)}) ${cleanPhone.slice(4, 7)}-${cleanPhone.slice(7, 9)}-${cleanPhone.slice(9, 11)}`;
    }
    
    return formatted;
}

// ============================================
// АВТОФОРМАТИРОВАНИЕ ПОЛЯ ТЕЛЕФОНА
// ============================================

function setupPhoneFormatting() {
    const phoneInput = document.getElementById('customerPhone');
    
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, ''); // Убираем все нецифровые символы
        
        // Если номер начинается с 8, заменяем на 7
        if (value.startsWith('8')) {
            value = '7' + value.slice(1);
        }
        
        // Если номер НЕ начинается с 7, добавляем 7 в начало
        if (value.length > 0 && !value.startsWith('7')) {
            value = '7' + value;
        }
        
        // Ограничиваем длину до 11 цифр
        if (value.length > 11) {
            value = value.slice(0, 11);
        }
        
        // Форматируем по маске +7 (XXX) XXX-XX-XX
        let formatted = '';
        if (value.length > 0) {
            formatted = '+7';
            if (value.length > 1) {
                formatted += ' (' + value.slice(1, 4);
            }
            if (value.length >= 4) {
                formatted += ') ' + value.slice(4, 7);
            }
            if (value.length >= 7) {
                formatted += '-' + value.slice(7, 9);
            }
            if (value.length >= 9) {
                formatted += '-' + value.slice(9, 11);
            }
        }
        
        e.target.value = formatted;
    });
    
    // При фокусе, если поле пустое, добавляем +7
    phoneInput.addEventListener('focus', function(e) {
        if (!e.target.value) {
            e.target.value = '+7 (';
        }
    });
    
    // При потере фокуса, если только +7, очищаем поле
    phoneInput.addEventListener('blur', function(e) {
        if (e.target.value === '+7 (' || e.target.value === '+7') {
            e.target.value = '';
        }
    });
}

// ============================================
// СЧЕТЧИК СИМВОЛОВ ДЛЯ TEXTAREA
// ============================================

function setupCharacterCounter() {
    const textarea = document.getElementById('customerMessage');
    const formGroup = textarea.closest('.form-group');
    
    // Создаем элемент счетчика
    const counter = document.createElement('div');
    counter.className = 'char-counter';
    counter.textContent = '0 / 500';
    formGroup.appendChild(counter);
    
    textarea.addEventListener('input', function() {
        const length = this.value.length;
        counter.textContent = `${length} / 500`;
        
        // Меняем цвет в зависимости от длины
        if (length < 10) {
            counter.style.color = '#999';
        } else if (length > 450) {
            counter.style.color = '#d4a574';
        } else {
            counter.style.color = '#4a4a4a';
        }
    });
}

// ============================================
// МОДАЛЬНОЕ ОКНО
// ============================================

function showModal(type, title, message) {
    const modal = document.getElementById('orderModal');
    const modalIcon = modal.querySelector('.modal-icon i');
    const modalTitle = modal.querySelector('.modal-title');
    const modalMessage = modal.querySelector('.modal-message');
    
    // Настраиваем иконку и стили в зависимости от типа
    if (type === 'success') {
        modalIcon.className = 'fas fa-check-circle';
        modalIcon.style.color = '#4CAF50';
    } else if (type === 'error') {
        modalIcon.className = 'fas fa-exclamation-circle';
        modalIcon.style.color = '#f44336';
    } else if (type === 'warning') {
        modalIcon.className = 'fas fa-exclamation-triangle';
        modalIcon.style.color = '#ff9800';
    }
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    // Показываем модальное окно
    modal.style.display = 'flex';
    
    // Добавляем анимацию появления
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function closeModal() {
    const modal = document.getElementById('orderModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

function setupModalHandlers() {
    const modal = document.getElementById('orderModal');
    const closeButton = modal.querySelector('.modal-close');
    const modalCloseBtn = modal.querySelector('#modalOkBtn');
    
    // Закрытие по клику на крестик
    closeButton.addEventListener('click', closeModal);
    
    // Закрытие по клику на кнопку "Отлично!"
    modalCloseBtn.addEventListener('click', closeModal);
    
    // Закрытие по клику вне модального окна
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });
}

// ============================================
// ОТПРАВКА В TELEGRAM
// ============================================

async function sendToTelegram(data) {
    try {
        const response = await fetch(PIPEDREAM_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: data.name,
                phone: data.phone,
                message: data.message
            })
        });
        
        if (response.ok) {
            return { success: true };
        } else {
            return { 
                success: false, 
                message: 'Не удалось отправить сообщение. Попробуйте позже.' 
            };
        }
    } catch (error) {
        return { 
            success: false, 
            message: 'Ошибка соединения. Проверьте интернет-подключение.' 
        };
    }
}

// ============================================
// ОБРАБОТКА ОТПРАВКИ ФОРМЫ
// ============================================

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    // Получаем значения полей
    const nameInput = document.getElementById('customerName');
    const phoneInput = document.getElementById('customerPhone');
    const messageInput = document.getElementById('customerMessage');
    
    const name = nameInput.value.trim();
    const phone = phoneInput.value;
    const message = messageInput.value.trim();
    
    // Удаляем предыдущие ошибки
    document.querySelectorAll('.form-error').forEach(el => el.remove());
    document.querySelectorAll('.form-group.error').forEach(el => el.classList.remove('error'));
    
    // Валидация
    let hasErrors = false;
    
    // Проверка имени
    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
        showFieldError(nameInput, nameValidation.message);
        hasErrors = true;
    }
    
    // Проверка телефона
    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.valid) {
        showFieldError(phoneInput, phoneValidation.message);
        hasErrors = true;
    }
    
    // Проверка сообщения
    const messageValidation = validateMessage(message);
    if (!messageValidation.valid) {
        showFieldError(messageInput, messageValidation.message);
        hasErrors = true;
    }
    
    // Если есть ошибки, прерываем отправку
    if (hasErrors) {
        return;
    }
    
    // Блокируем кнопку и показываем загрузку
    submitButton.disabled = true;
    submitButton.textContent = 'Отправка...';
    submitButton.style.opacity = '0.6';
    
    // Отправляем данные в Telegram
    const result = await sendToTelegram({
        name: name,
        phone: formatPhone(phone),
        message: message
    });
    
    // Восстанавливаем кнопку
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
    submitButton.style.opacity = '1';
    
    // Показываем результат
    if (result.success) {
        if (result.demo) {
            showModal(
                'warning',
                'Демо-режим',
                'Форма работает! Для реальной отправки настройте Telegram Bot в файле js/consultation.js (инструкция внутри файла).'
            );
        } else {
            showModal(
                'success',
                'Спасибо за обращение!',
                'Ваш вопрос получен. Наш менеджер свяжется с вами в ближайшее время.'
            );
        }
        
        // Очищаем форму
        e.target.reset();
        
        // Сбрасываем счетчик символов
        const counter = document.querySelector('.char-counter');
        if (counter) {
            counter.textContent = '0 / 500';
            counter.style.color = '#999';
        }
    } else {
        showModal(
            'error',
            'Ошибка отправки',
            result.message || 'Не удалось отправить форму. Пожалуйста, попробуйте позже или позвоните нам.'
        );
    }
}

/**
 * Показать ошибку под полем
 */
function showFieldError(inputElement, errorMessage) {
    const formGroup = inputElement.closest('.form-group');
    formGroup.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = errorMessage;
    
    formGroup.appendChild(errorDiv);
    
    // Скроллим к первой ошибке
    if (!document.querySelector('.form-error:first-of-type')) {
        inputElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const consultationForm = document.getElementById('consultationForm');
    
    if (consultationForm) {
        // Настраиваем автоформатирование телефона
        setupPhoneFormatting();
        
        // Настраиваем счетчик символов
        setupCharacterCounter();
        
        // Настраиваем обработчики модального окна
        setupModalHandlers();
        
        // Обработка отправки формы
        consultationForm.addEventListener('submit', handleFormSubmit);
    }
});
