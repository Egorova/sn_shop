/**
 * Назначение: Модуль страницы входа.
 * Дата создания: 01.04.2026
 * Автор: Екатерина
 * Ключевые функции: вход, валидация полей, показ/скрытие пароля.
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

function initPasswordToggle() {
    const password = document.getElementById('password');
    const eye = document.querySelector('.password_icon');
    if (password && eye) {
        eye.addEventListener('click', () => {
            password.type = password.type === 'password' ? 'text' : 'password';
        });
    }
}

function showDialog(title, message) {
    alert(`${title}
${message}`);
}

async function signIn() {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    if (!email || !password) {
        showDialog('Ошибка', 'Форма входа недоступна.');
        return;
    }
    if (!email.value.trim() || !password.value) {
        showDialog('Ошибка', 'Заполните e-mail и пароль.');
        return;
    }

    const { error } = await supabaseClient.auth.signInWithPassword({
        email: email.value.trim(),
        password: password.value
    });

    if (error) {
        showDialog('Ошибка входа', error.message);
        return;
    }
    window.location.href = 'home.html';
}

document.addEventListener('DOMContentLoaded', initPasswordToggle);
window.signIn = signIn;
