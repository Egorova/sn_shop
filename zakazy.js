/**
 * Назначение: Модуль страницы заказов.
 * Дата создания: 03.05.2026
 * Автор: Екатерина
 * Ключевые функции: загрузка и группировка заказов из Supabase.
 */

const supabaseUrl = 'https://iztivrbcgdeiwwietfpb.supabase.co';
const supabaseKey = 'sb_publishable_0-MDzHzubDbgFtteCpZU-Q_64PgkDoF';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

function getOrderTimeDisplay(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function getGroupTitle(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const orderDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (orderDate.getTime() === today.getTime()) return 'Недавние';
    if (orderDate.getTime() === yesterday.getTime()) return 'Вчерашние';

    return orderDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

async function renderOrders() {
    const container = document.getElementById('orders-container');
    if (!container) return;

    const { data, error } = await supabaseClient.from('orders').select('*').order('created_at', { ascending: false });
    if (error) {
        console.error('Ошибка Supabase:', error);
        return;
    }

    container.innerHTML = '';
    const groups = {};

    data.forEach((order) => {
        const dateValue = order.created_at || new Date().toISOString();
        const title = getGroupTitle(dateValue);
        if (!groups[title]) groups[title] = [];
        groups[title].push(order);
    });

    Object.entries(groups).forEach(([title, items]) => {
        const sectionTitle = document.createElement('h2');
        sectionTitle.className = 'section-title';
        sectionTitle.textContent = title;
        container.appendChild(sectionTitle);

        items.forEach((item) => {
            const timeDisplay = getOrderTimeDisplay(item.created_at || new Date().toISOString());
            const html = `<div class="cart-item-container"><div class="cart-card main-card"><div class="cart-img-box"><img class="item-img" src="${item.image_url}" alt="Кроссовки"></div><div class="order-info"><div class="order-header-row"><span class="order-number">№ ${item.id}</span><span class="order-time">${timeDisplay}</span></div><h3 class="order-title">${item.title}</h3><div class="order-price-row"><span class="current-price">₽${item.price}</span></div></div></div></div>`;
            container.insertAdjacentHTML('beforeend', html);
        });
    });
}

document.addEventListener('DOMContentLoaded', renderOrders);
