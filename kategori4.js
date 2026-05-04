/**
 * Назначение: Модуль экрана категории 4.
 * Дата создания: 14.04.2026
 * Автор: Екатерина
 * Ключевые функции: обработка кнопок карточек товаров.
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

function toggleLike(element) {
    if (!element) return;
    element.src = element.src.includes('/img/like_def.svg') ? '/img/like_red.svg' : '/img/like_def.svg';
}

function toggleCart(element) {
    if (!element) return;
    element.src = element.src.includes('/img/cart_def.svg') ? '/img/cart_+.svg' : '/img/cart_def.svg';
}

function toggleLikes(element) {
    if (!element) return;
    element.src = element.src.includes('/img/Favorite_kard.svg') ? '/img/Favorite_kart_red.svg' : '/img/Favorite_kard.svg';
}

window.toggleLike = toggleLike;
window.toggleCart = toggleCart;
window.toggleLikes = toggleLikes;

