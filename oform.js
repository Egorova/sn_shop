/**
 * Назначение: Модуль страницы оформления заказа.
 * Дата создания: 23.04.2026
 * Автор: Екатерина
 * Ключевые функции: редактирование полей, подтверждение заказа.
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

function editData(id) {
    const element = document.getElementById(id);
    if (!element) return;

    const input = document.createElement('input');
    input.value = element.innerText;
    input.className = 'editable-input';

    element.innerHTML = '';
    element.appendChild(input);
    input.focus();

    input.addEventListener('blur', () => { element.innerText = input.value; });
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') element.innerText = input.value;
    });
}

function openZaz() {
    const overlay = document.getElementById('zazOverlay');
    if (overlay) overlay.style.display = 'flex';
}

function backbay() {
    window.location.href = 'cart.html';
}

window.editData = editData;
window.openZaz = openZaz;
window.backbay = backbay;
