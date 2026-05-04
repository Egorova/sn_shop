/**
 * Назначение: Модуль редактирования профиля.
 * Дата создания: 24.04.2026
 * Автор: Екатерина
 * Ключевые функции: камера, фото, сохранение данных профиля.
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

function openCam() {
    const overlay = document.getElementById('camOverlay');
    if (overlay) overlay.style.display = 'flex';
}

function backlk() {
    window.location.href = 'lk.html';
}

async function openCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        const video = document.createElement('video');
        video.srcObject = stream;
        video.setAttribute('playsinline', true);
        await video.play();

        const container = document.querySelector('.map-container');
        if (!container) return;
        container.innerHTML = '';
        container.appendChild(video);
    } catch (error) {
        alert('Не удалось открыть камеру. Проверьте разрешения.');
    }
}

function handleFile(event) {
    const input = event?.target;
    if (!input?.files?.[0]) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
        const container = document.querySelector('.map-container');
        if (!container) return;
        const image = document.createElement('img');
        image.src = loadEvent.target.result;
        image.style.width = '100%';
        image.style.height = '100%';
        image.style.objectFit = 'cover';
        image.style.borderRadius = '16px';
        container.innerHTML = '';
        container.appendChild(image);
    };
    reader.readAsDataURL(input.files[0]);
}

function saveProfileData() {
    const name = document.getElementById('edit-name')?.value || '';
    const surname = document.getElementById('edit-surname')?.value || '';
    const address = document.getElementById('edit-address')?.value || '';
    const phone = document.getElementById('edit-phone')?.value || '';
    const avatar = document.getElementById('avatar-preview')?.src || '';

    localStorage.setItem('userName', name);
    localStorage.setItem('userSurname', surname);
    localStorage.setItem('userAddress', address);
    localStorage.setItem('userPhone', phone);
    localStorage.setItem('userAvatar', avatar);

    alert('Данные сохранены.');
    window.location.href = 'lk.html';
}

function fillInputs() {
    const nameInput = document.getElementById('edit-name');
    const surnameInput = document.getElementById('edit-surname');
    const addressInput = document.getElementById('edit-address');
    const phoneInput = document.getElementById('edit-phone');
    const avatarPreview = document.getElementById('avatar-preview');

    if (nameInput) nameInput.value = localStorage.getItem('userName') || '';
    if (surnameInput) surnameInput.value = localStorage.getItem('userSurname') || '';
    if (addressInput) addressInput.value = localStorage.getItem('userAddress') || '';
    if (phoneInput) phoneInput.value = localStorage.getItem('userPhone') || '';

    const savedAvatar = localStorage.getItem('userAvatar');
    if (avatarPreview && savedAvatar) avatarPreview.src = savedAvatar;
}

document.addEventListener('DOMContentLoaded', fillInputs);
window.openCam = openCam;
window.backlk = backlk;
window.openCamera = openCamera;
window.handleFile = handleFile;
window.saveProfileData = saveProfileData;
