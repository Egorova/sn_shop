/**
 * Назначение: Скрипт промежуточного экрана загрузки.
 * Дата создания: 01.04.2026
 * Автор: Екатерина
 * Ключевые функции: автопереход на главный экран.
 */
const supabaseUrl = 'https://iztivrbcgdeiwwietfpb.supabase.co';
const supabaseKey = 'sb_publishable_0-MDzHzubDbgFtteCpZU-Q_64PgkDoF';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);


setTimeout(() => { window.location.href = 'glav.html'; }, 2000);
