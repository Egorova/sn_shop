/**
 * Назначение: Обработка свайпов для удаления товаров в корзине
 * Автор: Екатерина
 * Дата: 04.05.2026
 */

let touchstartX = 0;
let touchendX = 0;

function handleTouchStart(event) {
    touchstartX = event.changedTouches[0].screenX;
}

function handleTouchEnd(event, element) {
    touchendX = event.changedTouches[0].screenX;
    handleGesture(element);
}

function handleGesture(element) {
    const swipedistance = touchstartX - touchendX;
    
    // влево
    if (swipedistance > 50) {
        element.classList.add('swiped-left');
        console.log('Свайп влево: удаляем товар');
    } 
    // вправо
    else if (swipedistance < -50) {
        element.classList.remove('swiped-left');
        console.log('Свайп вправо: отмена');
    }
}


/**
 * Назначение: Модуль страницы корзины.
 * Дата создания: 19.04.2026
 * Автор: Екатерина
 * Ключевые функции: количество товаров, удаление, пересчет суммы.
 */

function parseArgument(rawValue, element) {
    const value = rawValue.trim();
    if (value === 'this') return element;
    if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) return value.slice(1, -1);
    if (!Number.isNaN(Number(value))) return Number(value);
    return value;
}

function runDataClickHandler(expression, element) {
    const normalized = expression.trim();
    const locationMatch = normalized.match(/^window\.location\.href\s*=\s*['"]([^'"]+)['"]$/);
    if (locationMatch) { window.location.href = locationMatch[1]; return; }
    const match = normalized.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\((.*)\)$/);
    if (!match) return;
    const functionName = match[1];
    const argsText = match[2];
    const targetFunction = window[functionName];
    if (typeof targetFunction !== 'function') return;
    const args = argsText.trim() ? argsText.split(',').map((part) => parseArgument(part, element)) : [];
    targetFunction(...args);
}

document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-click-handler]');
    if (!target) return;
    const expression = target.getAttribute('data-click-handler');
    if (!expression) return;
    runDataClickHandler(expression, target);
});

function calculateFullTotal() {
    let subtotal = 0;
    const allItems = document.querySelectorAll('.cart-item-container');

    allItems.forEach((item) => {
        const priceElement = item.querySelector('.item-price');
        if (!priceElement) return;
        const value = parseFloat(priceElement.innerText.replace('₽', ''));
        subtotal += Number.isNaN(value) ? 0 : value;
    });

    const delivery = allItems.length > 0 ? 60.2 : 0;
    const deliveryElement = document.querySelector('.delivery-price');
    if (deliveryElement) deliveryElement.innerText = `₽${delivery.toFixed(2)}`;

    const totalSumElement = document.querySelector('.total-sum');
    const grandTotalElement = document.querySelector('.grand-total');
    const counterHeader = document.querySelector('.total-items-count');

    if (totalSumElement) totalSumElement.innerText = `₽${subtotal.toFixed(2)}`;
    if (grandTotalElement) grandTotalElement.innerText = `₽${(subtotal + delivery).toFixed(2)}`;
    if (counterHeader) counterHeader.innerText = `${allItems.length} товара`;
}

function updateItemQty(button, delta) {
    const container = button?.closest('.cart-item-container');
    if (!container) return;

    const countSpan = container.querySelector('.item-count');
    const priceDisplay = container.querySelector('.item-price');
    if (!countSpan || !priceDisplay) return;

    const unitPrice = parseFloat(priceDisplay.getAttribute('data-unit-price'));
    let currentCount = parseInt(countSpan.innerText, 10);
    currentCount += delta;

    if (currentCount >= 1) {
        countSpan.innerText = currentCount;
        priceDisplay.innerText = `₽${(unitPrice * currentCount).toFixed(2)}`;
        calculateFullTotal();
    }
}

function removeItem(button) {
    const item = button?.closest('.cart-item-container');
    if (!item) return;

    item.style.transform = 'translateX(-150%)';
    item.style.opacity = '0';
    setTimeout(() => {
        item.remove();
        calculateFullTotal();
    }, 300);
}

document.addEventListener('DOMContentLoaded', calculateFullTotal);
window.handleTouchStart = handleTouchStart;
window.handleTouchEnd = handleTouchEnd;
