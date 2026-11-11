
import './scss/styles.scss';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';

import { CatalogModel } from './components/Models/CatalogModel';
import { BasketModel } from './components/Models/BasketModel';
import { BuyerModel } from './components/Models/BuyerModel';

import { ApiService } from './components/ApiService';

import { Gallery } from './components/View/Gallery';
import { Header } from './components/View/Header';
import { CardCatalog } from './components/View/CardCatalog';
import { CardPreview } from './components/View/CardPreview';
import { Modal } from './components/View/Modal';
import { BasketItem } from './components/View/BasketItem';
import { BasketView } from './components/View/BasketView';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { Success } from './components/View/Success';

import { cloneTemplate } from './utils/utils';
import { API_URL } from './utils/constants';

import { IProduct, IOrder, TPayment } from './types';

// ============================================
// Инициализация приложения
// ============================================

const events = new EventEmitter();

const catalog = new CatalogModel(events);
const basket = new BasketModel(events);
const buyer = new BuyerModel(events);

const api = new Api(API_URL);
const apiService = new ApiService(api);

// ============================================
// Получение HTML-элементов
// ============================================

function getRequiredElement<T extends HTMLElement>(
    selector: string
): T {
    const element = document.querySelector<T>(selector);

    if (!element) {
        throw new Error(`Не найден элемент: ${selector}`);
    }

    return element;
}

const galleryElement = getRequiredElement<HTMLElement>('.gallery');
const modalElement = getRequiredElement<HTMLElement>('#modal-container');
const headerElement = getRequiredElement<HTMLElement>('.header');

// ============================================
// Создание компонентов View
// ============================================

const gallery = new Gallery(galleryElement);
const modal = new Modal(modalElement);

let orderForm: OrderForm | null = null;
let contactsForm: ContactsForm | null = null;

const header = new Header(headerElement, () => {
    openBasket();
});

// ============================================
// Функции Presenter
// ============================================

// Обновление счётчика корзины

function updateBasketCounter(): void {
    header.counter = basket.getProductCount();
}

// Отображение ошибок и состояния первой формы

function updateOrderForm(): void {
    if (!orderForm) {
        return;
    }

    const errors = buyer.validateBuyerData();

    const orderErrors = [
        errors.payment,
        errors.address
    ].filter(Boolean);

    orderForm.errors = orderErrors.join('. ');
    orderForm.valid = orderErrors.length === 0;
}

// Отображение ошибок и состояния второй формы

function updateContactsForm(): void {
    if (!contactsForm) {
        return;
    }

    const errors = buyer.validateBuyerData();

    const contactsErrors = [
        errors.email,
        errors.phone
    ].filter(Boolean);

    contactsForm.errors = contactsErrors.join('. ');
    contactsForm.valid = contactsErrors.length === 0;
}

// Отображение успешного оформления заказа

function showSuccess(total: number): void {
    const successElement = cloneTemplate<HTMLElement>('#success');

    const success = new Success(
        successElement,
        () => {
            modal.close();
        }
    );

    success.total = total;

    modal.content = success.render();
    modal.open();
}

// ============================================
// Отображение каталога
// ============================================

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

// ============================================
// Открытие карточки товара
// ============================================

function openPreview(product: IProduct): void {
    catalog.chooseProduct(product);

    const previewElement = cloneTemplate<HTMLElement>('#card-preview');

    const preview = new CardPreview(events, previewElement);

    preview.title = product.title;
    preview.price = product.price;
    preview.category = product.category;

    preview.image = {
        src: product.image,
        alt: product.title
    };

    preview.description = product.description;

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

// ============================================
// Открытие корзины
// ============================================

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
    basketView.orderDisabled = products.length === 0;

    modal.content = basketView.render();
    modal.open();
}

// ============================================
// Открытие первой формы: оплата и адрес
// ============================================

function openOrder(): void {
    const orderElement = cloneTemplate<HTMLFormElement>('#order');

    orderForm = new OrderForm(events, orderElement);

    const buyerData = buyer.getBuyerData();

    orderForm.payment = buyerData.payment;
    orderForm.address = buyerData.address;

    updateOrderForm();

    modal.content = orderForm.render();
    modal.open();
}

// ============================================
// Открытие второй формы: контакты
// ============================================

function openContacts(): void {
    const errors = buyer.validateBuyerData();

    const orderErrors = [
        errors.payment,
        errors.address
    ].filter(Boolean);

    if (orderErrors.length > 0) {
        if (orderForm) {
            orderForm.errors = orderErrors.join('. ');
            orderForm.valid = false;
        }

        return;
    }

    const contactsElement = cloneTemplate<HTMLFormElement>('#contacts');

    contactsForm = new ContactsForm(events, contactsElement);

    const buyerData = buyer.getBuyerData();

    contactsForm.email = buyerData.email;
    contactsForm.phone = buyerData.phone;

    updateContactsForm();

    modal.content = contactsForm.render();
    modal.open();
}

// ============================================
// Отправка заказа
// ============================================

async function submitOrder(): Promise<void> {
    const errors = buyer.validateBuyerData();

    const errorMessages = Object.values(errors).filter(Boolean);

    if (errorMessages.length > 0) {
        if (contactsForm) {
            const contactsErrors = [
                errors.email,
                errors.phone
            ].filter(Boolean);

            contactsForm.errors = contactsErrors.join('. ');
            contactsForm.valid = false;
        }

        return;
    }

    const buyerData = buyer.getBuyerData();

    if (
        !buyerData.payment ||
        !buyerData.address ||
        !buyerData.email ||
        !buyerData.phone
    ) {
        if (contactsForm) {
            contactsForm.errors = 'Проверьте заполнение всех полей';
            contactsForm.valid = false;
        }

        return;
    }

    if (basket.getProductCount() === 0) {
        if (contactsForm) {
            contactsForm.errors = 'Корзина пуста';
            contactsForm.valid = false;
        }

        return;
    }

    const order: IOrder = {
        payment: buyerData.payment,
        address: buyerData.address,
        email: buyerData.email,
        phone: buyerData.phone,
        total: basket.getTotalPrice(),
        items: basket.getProducts().map((product) => product.id)
    };

    try {
        const response = await apiService.createOrder(order);

        basket.clearBasket();
        buyer.clearBuyerData();

        orderForm = null;
        contactsForm = null;

        showSuccess(response.total);
    } catch (error: unknown) {
        console.error('Ошибка оформления заказа:', error);

        if (contactsForm) {
            contactsForm.errors =
                'Не удалось оформить заказ. Попробуйте ещё раз.';
        }
    }
}

// ============================================
// Подписки на события моделей
// ============================================

// Изменение каталога

events.on('catalog:changed', () => {
    renderCatalog(catalog.getProducts());
});

// Изменение корзины

events.on('basket:changed', () => {
    updateBasketCounter();
});

// Изменение данных покупателя

events.on('buyer:changed', () => {
    updateOrderForm();
    updateContactsForm();
});

// ============================================
// Подписки на события View
// ============================================

// Нажатие кнопки покупки или удаления товара

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

// Переход ко второй форме

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

// ============================================
// Запуск приложения
// ============================================

// Начальное значение счётчика корзины

updateBasketCounter();

// Загрузка каталога с сервера

apiService.getProducts()
    .then((response) => {
        catalog.saveProducts(response.items);
    })
    .catch((error: unknown) => {
        console.error('Ошибка загрузки каталога:', error);
    });
