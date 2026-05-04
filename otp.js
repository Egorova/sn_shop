/**
 * Назначение: Модуль подтверждения OTP-кода.
 * Дата создания: 03.04.2026
 * Автор: Екатерина
 * Ключевые функции: таймер, проверка шестизначного кода.
 */

document.addEventListener('DOMContentLoaded', () => {
    let time = 60;
    const display = document.getElementById('timer');
    const button = document.getElementById('resendCode');

    if (button) {
        const timerId = setInterval(() => {
            const min = Math.floor(time / 60);
            const sec = String(time % 60).padStart(2, '0');
            if (display) display.innerText = `${min}:${sec}`;

            if (time <= 0) {
                clearInterval(timerId);
                button.style.opacity = '1';
                button.style.cursor = 'pointer';
                button.style.color = '#47A2E5';
                button.addEventListener('click', () => location.reload(), { once: true });
            }
            time -= 1;
        }, 1000);
    }

    const inputs = Array.from(document.querySelectorAll('.otpcotiki'));
    inputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            if (input.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }

            const code = inputs.map((el) => el.value).join('');
            if (code.length === 6) {
                if (code === '123456') {
                    window.location.href = 'new_pass.html';
                } else {
                    alert('Неверный код, попробуйте еще раз.');
                    inputs.forEach((el) => { el.value = ''; });
                    inputs[0].focus();
                }
            }
        });
    });
});
