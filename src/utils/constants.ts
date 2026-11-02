// Константа для получения полного пути для сервера.
// Для выполнения запроса необходимо к API_URL добавить только эндпоинт.
export const API_URL = `${import.meta.env.VITE_API_ORIGIN}/api/weblarek`;

// Константа для формирования полного пути к изображениям карточек.
// Для получения полной ссылки к CDN_URL добавляется название файла изображения.
export const CDN_URL = `${import.meta.env.VITE_API_ORIGIN}/content/weblarek`;

// Соответствие категорий товара CSS-модификаторам.
export const categoryMap = {
    'софт-скил': 'card__category_soft',
    'хард-скил': 'card__category_hard',
    'кнопка': 'card__category_button',
    'дополнительное': 'card__category_additional',
    'другое': 'card__category_other',
};

// Настройки отображения товаров.
export const settings = {
    pricelessText: 'Бесценно',
    currency: 'синапсов',
};