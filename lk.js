/**
 * Назначение: Модуль страницы профиля.
 * Дата создания: 23.04.2026
 * Автор: Екатерина
 * Ключевые функции: показ QR-попапа, подстановка данных профиля.
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

function openPopup() {
    const popup = document.getElementById('popupOverlay');
    if (popup) popup.style.display = 'flex';
}

function backlk() {
    const popup = document.getElementById('popupOverlay');
    if (popup) popup.style.display = 'none';
}

function loadProfileData() {
    const savedName = localStorage.getItem('userName') || '';
    const savedSurname = localStorage.getItem('userSurname') || '';
    const savedAddress = localStorage.getItem('userAddress') || '';
    const savedAvatar = localStorage.getItem('userAvatar') || '';

    const fullEl = document.getElementById('display-full-name');
    if (fullEl && (savedName || savedSurname)) fullEl.innerText = `${savedName} ${savedSurname}`.trim();

    const nameEl = document.getElementById('display-name');
    if (nameEl && savedName) nameEl.innerText = savedName;

    const surEl = document.getElementById('display-sur');
    if (surEl && savedSurname) surEl.innerText = savedSurname;

    const addrEl = document.getElementById('display-address');
    if (addrEl && savedAddress) addrEl.innerText = savedAddress;

    const avatarEl = document.getElementById('display-avatar');
    if (avatarEl && savedAvatar) avatarEl.src = savedAvatar;
}

document.addEventListener('click', (event) => {
    const popup = document.getElementById('popupOverlay');
    if (popup && event.target === popup) popup.style.display = 'none';
});

document.addEventListener('DOMContentLoaded', loadProfileData);
window.openPopup = openPopup;
window.backlk = backlk;
