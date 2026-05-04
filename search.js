/**
 * Назначение: Модуль экрана поиска.
 * Дата создания: 06.04.2026
 * Автор: Екатерина
 * Ключевые функции: обработка Enter и переход к результатам.
 */

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('searchInput');
    if (!input) return;
    input.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && input.value.toLowerCase().trim() === 'nike air max') {
            window.location.href = 'searchnike.html';
        }
    });
});
