
import './scss/styles.scss';

// =====================================
// 1. Импорты
// =====================================

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';

import { CatalogModel } from './components/Models/CatalogModel';
import { BasketModel } from './components/Models/BasketModel';
import { BuyerModel } from './components/Models/BuyerModel';

import { ApiService } from './components/ApiService';

import { Gallery } from './components/View/Gallery';
import { CardCatalog } from './components/View/CardCatalog';
import { CardPreview } from './components/View/CardPreview';
import { Modal } from './components/View/Modal';
import { BasketItem } from './components/View/BasketItem';
import { BasketView } from './components/View/BasketView';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';

import { cloneTemplate } from './utils/utils';
import { API_URL } from './utils/constants';

import { IProduct, IOrder, TPayment } from './types';


// =====================================
// 2. Инициализация основных объектов
// =====================================

// Брокер событий
const events = new EventEmitter();

// Модели данных
const catalog = new CatalogModel(events);
const basket = new BasketModel(events);
const buyer = new BuyerModel(events);

// API
const api = new Api(API_URL);
const apiService = new ApiService(api);


// =====================================
// 3. Получение HTML-элементов
// =====================================

function getRequiredElement<T extends HTMLElement>(
    selector: string
): T {
    const element = document.querySelector<T>(selector);

    if (!element) {
        throw new Error(`Не найден элемент: ${selector}`);
    }

    return element;
}

// Основные элементы страницы
const galleryElement = getRequiredElement<HTMLElement>('.gallery');
const modalElement = getRequiredElement<HTMLElement>('#modal-container');

const basketCounter = getRequiredElement<HTMLElement>(
    '.header__basket-counter'
);

const basketButton = getRequiredElement<HTMLButtonElement>(
    '.header__basket'
);

// Представления
const gallery = new Gallery(galleryElement);
const modal = new Modal(events, modalElement);

// Текущие формы
let orderForm: OrderForm | null = null;
let contactsForm: ContactsForm | null = null;


// =====================================
// 4. Вспомогательные функции
// =====================================

// Обновление счётчика корзины
function updateBasketCounter(): void {
    basketCounter.textContent = String(basket.getProductCount());
}

// Отображение успешного заказа
function showSuccess(total: number): void {
    const successElement = cloneTemplate<HTMLElement>('#success');

    const description = successElement.querySelector<HTMLElement>(
        '.order-success__description'
    );

    const closeButton = successElement.querySelector<HTMLButtonElement>(
        '.order-success__close'
    );

    if (!description || !closeButton) {
        throw new Error('Не найдены элементы окна успешного заказа');
    }

    description.textContent = `Списано ${total} синапсов`;

    closeButton.addEventListener('click', () => {
        modal.close();
    });

    modal.content = successElement;
    modal.open();
}


// =====================================
// 5. Работа с каталогом
// =====================================

// Создание и отображение карточек товаров
function renderCatalog(products: IProduct[]): void {
    const cards = products.map((product) => {
        const cardElement = cloneTemplate<HTMLElement>('#card-catalog');

        const card = new CardCatalog(cardElement, {
            onClick: () => {
                openPreview(product);
            }
        });

        card.title = product.title;
        card.price = product.price;
        card.category = product.category;
        card.image = product.image;

        return card.render();
    });

    gallery.catalog = cards;
}


// =====================================
// 6. Просмотр карточки товара
// =====================================

function openPreview(product: IProduct): void {
    // Сохраняем выбранный товар в модели
    catalog.chooseProduct(product);

    // Создаём карточку предпросмотра
    const previewElement = cloneTemplate<HTMLElement>('#card-preview');
    const preview = new CardPreview(events, previewElement);

    // Заполняем информацию о товаре
    preview.title = product.title;
    preview.price = product.price;
    preview.category = product.category;
    preview.image = product.image;
    preview.description = product.description;

    // Проверяем доступность и наличие товара в корзине
    const alreadyInBasket = basket.hasProduct(product.id);

    if (product.price === null) {
        preview.buttonText = 'Недоступно';
        preview.buttonDisabled = true;
    } else if (alreadyInBasket) {
        preview.buttonText = 'Удалить из корзины';
        preview.buttonDisabled = false;
    } else {
        preview.buttonText = 'Купить';
        preview.buttonDisabled = false;
    }

    modal.content = preview.render();
    modal.open();
}


// =====================================
// 7. Работа с корзиной
// =====================================

// Создание и отображение корзины
function openBasket(): void {
    const basketElement = cloneTemplate<HTMLElement>('#basket');

    const basketView = new BasketView(
        basketElement,
        () => {
            openOrder();
        }
    );

    const products = basket.getProducts();

    const basketItems = products.map((product, index) => {
        const itemElement = cloneTemplate<HTMLElement>('#card-basket');

        const item = new BasketItem(itemElement, () => {
            basket.removeProduct(product.id);
            openBasket();
        });

        item.title = product.title;
        item.price = product.price;
        item.index = index + 1;

        return item.render();
    });

    basketView.items = basketItems;
    basketView.total = basket.getTotalPrice();

    modal.content = basketView.render();
    modal.open();
}


// =====================================
// 8. Оформление заказа
// =====================================

// Открытие первой формы: способ оплаты и адрес
function openOrder(): void {
    const orderElement = cloneTemplate<HTMLFormElement>('#order');

    orderForm = new OrderForm(events, orderElement);

    const buyerData = buyer.getBuyerData();

    // Восстанавливаем ранее введённые данные
    if (buyerData.payment) {
        orderForm.payment = buyerData.payment;
    }

    orderForm.address = buyerData.address || '';

    modal.content = orderForm.render();
    modal.open();
}


// Открытие второй формы: email и телефон
function openContacts(): void {
    const errors = buyer.validateBuyerData();

    const orderErrors = [
        errors.payment,
        errors.address
    ].filter(Boolean);

    if (orderErrors.length > 0) {
        if (orderForm) {
            orderForm.errors = orderErrors.join('. ');
        }

        return;
    }

    const contactsElement = cloneTemplate<HTMLFormElement>('#contacts');

    contactsForm = new ContactsForm(events, contactsElement);

    const buyerData = buyer.getBuyerData();

    contactsForm.email = buyerData.email || '';
    contactsForm.phone = buyerData.phone || '';

    modal.content = contactsForm.render();
    modal.open();
}


// =====================================
// 9. Отправка заказа
// =====================================

async function submitOrder(): Promise<void> {
    // Проверяем данные покупателя
    const errors = buyer.validateBuyerData();

    const errorMessages = Object.values(errors).filter(Boolean);

    if (errorMessages.length > 0) {
        if (contactsForm) {
            contactsForm.errors = errorMessages.join('. ');
        }

        return;
    }

    const buyerData = buyer.getBuyerData();

    // Дополнительная проверка обязательных данных
    if (
        !buyerData.payment ||
        !buyerData.address ||
        !buyerData.email ||
        !buyerData.phone
    ) {
        if (contactsForm) {
            contactsForm.errors = 'Проверьте заполнение всех полей';
        }

        return;
    }

    // Проверяем, что корзина не пуста
    if (basket.getProductCount() === 0) {
        if (contactsForm) {
            contactsForm.errors = 'Корзина пуста';
        }

        return;
    }

    // Формируем объект заказа
    const order: IOrder = {
        payment: buyerData.payment,
        address: buyerData.address,
        email: buyerData.email,
        phone: buyerData.phone,
        total: basket.getTotalPrice(),
        items: basket.getProducts().map((product) => product.id)
    };

    try {
        // Отправляем заказ на сервер
        const response = await apiService.createOrder(order);

        // Очищаем данные после успешного оформления
        basket.clearBasket();
        buyer.clearBuyerData();

        // Сбрасываем ссылки на формы
        orderForm = null;
        contactsForm = null;

        // Показываем результат оформления
        showSuccess(response.total);

        console.log('Заказ успешно оформлен:', response);

    } catch (error: unknown) {
        console.error('Ошибка оформления заказа:', error);

        if (contactsForm) {
            contactsForm.errors =
                'Не удалось оформить заказ. Попробуйте ещё раз.';
        }
    }
}


// =====================================
// 10. Обработчики событий
// =====================================

// Закрытие модального окна
events.on('modal:close', () => {
    modal.close();
});


// Обновление каталога после загрузки товаров
events.on('catalog:changed', () => {
    renderCatalog(catalog.getProducts());
});


// Обновление счётчика корзины
events.on('basket:changed', () => {
    updateBasketCounter();
});


// Добавление или удаление товара из корзины
events.on('preview:button-click', () => {
    const product = catalog.getChosenProduct();

    if (!product || product.price === null) {
        return;
    }

    if (basket.hasProduct(product.id)) {
        basket.removeProduct(product.id);
    } else {
        basket.addProduct(product);
    }

    modal.close();
});


// Изменение способа оплаты
events.on('order:payment-change', (data: { payment: TPayment }) => {
    buyer.updateBuyerData({
        payment: data.payment
    });
});


// Изменение адреса
events.on('order:address-change', (data: { address: string }) => {
    buyer.updateBuyerData({
        address: data.address
    });
});


// Переход ко второй форме заказа
events.on('order:submit', () => {
    openContacts();
});


// Изменение email
events.on('contacts:email-change', (data: { email: string }) => {
    buyer.updateBuyerData({
        email: data.email
    });
});


// Изменение телефона
events.on('contacts:phone-change', (data: { phone: string }) => {
    buyer.updateBuyerData({
        phone: data.phone
    });
});


// Отправка заказа
events.on('contacts:submit', () => {
    void submitOrder();
});


// =====================================
// 11. Обработчики кнопок интерфейса
// =====================================

// Открытие корзины
basketButton.addEventListener('click', () => {
    openBasket();
});


// =====================================
// 12. Запуск приложения
// =====================================

// Начальное состояние счётчика корзины
updateBasketCounter();

// Загружаем товары с сервера
apiService.getProducts()
    .then((response) => {
        // Сохраняем товары в модели.
        // Событие catalog:changed автоматически обновит каталог.
        catalog.saveProducts(response.items);

        console.log('Каталог загружен:', response.total);
    })
    .catch((error: unknown) => {
        console.error('Ошибка загрузки каталога:', error);
    });
