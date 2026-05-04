/**
 * Назначение: Модуль страницы регистрации.
 * Дата создания: 02.04.2026
 * Автор: Екатерина
 * Ключевые функции: регистрация, проверка email, согласие с политикой.
 */

const signUpEmailPattern = /^[a-z0-9]+@[a-z0-9]+\.[a-z0-9]{2,}$/;

// данные Supabase
const supabaseUrl = 'https://iztivrbcgdeiwwietfpb.supabase.co';
const supabaseKey = 'sb_publishable_0-MDzHzubDbgFtteCpZU-Q_64PgkDoF';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

function showCustomDialog(title, message) {
    const existingDialog = document.getElementById('custom-dialog-overlay');
    if (existingDialog) {
        existingDialog.remove();
    }

    const overlay = document.createElement('div');
    overlay.id = 'custom-dialog-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;z-index:99999;';

    const dialog = document.createElement('div');
    dialog.style.cssText = 'background:#fff;border-radius:20px;padding:20px;max-width:320px;width:85%;text-align:center;font-family:Arial,sans-serif;';

    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    titleElement.style.cssText = 'margin:0 0 10px;color:#1A2530;font-size:20px;';

    const textElement = document.createElement('p');
    textElement.textContent = message;
    textElement.style.cssText = 'margin:0 0 16px;color:#707B81;line-height:1.4;';

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.textContent = 'ОК';
    closeButton.style.cssText = 'border:none;background:#47A2E5;color:#fff;border-radius:12px;padding:10px 24px;cursor:pointer;';
    closeButton.addEventListener('click', () => overlay.remove());

    dialog.append(titleElement, textElement, closeButton);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
}

function initSignUpPasswordToggle() {
    const passwordField = document.getElementById('password');
    const toggleIcon = document.querySelector('.pass_icon');

    if (passwordField && toggleIcon) {
        toggleIcon.addEventListener('click', () => {
            const nextType = passwordField.type === 'password' ? 'text' : 'password';
            passwordField.type = nextType;
        });
    }
}

async function signUp() {
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');
    const policyCheckbox = document.getElementById('policyCheckbox');

    if (!nameField || !emailField || !passwordField || !policyCheckbox) {
        showCustomDialog('Ошибка', 'Не удалось загрузить форму регистрации.');
        return;
    }

    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const password = passwordField.value;
    const isPolicyChecked = policyCheckbox.checked;

    if (!name || !email || !password) {
        showCustomDialog('Ошибка', 'Все поля должны быть заполнены.');
        return;
    }

    if (!signUpEmailPattern.test(email)) {
        showCustomDialog(
            'Некорректный e-mail',
            'Введите e-mail в формате name@domenname.ru (только строчные буквы и цифры).'
        );
        return;
    }

    if (!isPolicyChecked) {
        showCustomDialog('Ошибка', 'Подтвердите согласие на обработку персональных данных.');
        return;
    }

    if (!window.supabaseClient) {
        showCustomDialog('Ошибка', 'Клиент Supabase не инициализирован.');
        return;
    }

    const { error } = await window.supabaseClient.auth.signUp({
        email,
        password,
        options: {
            data: {
                display_name: name
            }
        }
    });

    if (error) {
        showCustomDialog('Ошибка сервера', error.message);
        return;
    }

    window.location.href = 'home.html';
}

document.addEventListener('DOMContentLoaded', initSignUpPasswordToggle);
window.signUp = signUp;
