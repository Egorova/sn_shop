/**
 * Назначение: Модуль обновления пароля.
 * Дата создания: 03.04.2026
 * Автор: Екатерина
 * Ключевые функции: индикатор надежности нового пароля.
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

document.addEventListener('DOMContentLoaded', () => {
    const pass = document.getElementById('passInput');
    const bars = Array.from(document.getElementsByClassName('yr'));
    if (!pass || bars.length < 3) return;

    pass.addEventListener('input', () => {
        const v = pass.value.length;
        bars.forEach((bar) => { bar.style.background = '#E0E0E0'; });

        if (v >= 1 && v <= 7) {
            bars[0].style.background = '#EF484A';
        } else if (v >= 8 && v <= 9) {
            bars[0].style.background = '#E8EA5B';
            bars[1].style.background = '#E8EA5B';
        } else if (v >= 10) {
            bars[0].style.background = '#67D583';
            bars[1].style.background = '#67D583';
            bars[2].style.background = '#67D583';
        }
    });
});
