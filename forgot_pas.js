/**
 * Назначение: Модуль восстановления пароля.
 * Дата создания: 03.04.2026
 * Автор: Екатерина
 * Ключевые функции: показ попапа, переход на OTP.
 */

const supabaseUrl = 'https://iztivrbcgdeiwwietfpb.supabase.co';
const supabaseKey = 'sb_publishable_0-MDzHzubDbgFtteCpZU-Q_64PgkDoF';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

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

function otp() {
    window.location.href = 'otp.html';
}

window.openPopup = openPopup;
window.otp = otp;
