import './scss/styles.scss';

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
import { apiProducts } from './utils/data';

import { IProduct, IOrder, TPayment } from './types';

// Инициализация основных объектов
const events = new EventEmitter();

const catalog = new CatalogModel();
const basket = new BasketModel();
const buyer = new BuyerModel();

const api = new Api(API_URL);
const apiService = new ApiService(api);

// Проверка методов моделей
function testModels(): void {
    console.log('========== ТЕСТИРОВАНИЕ МОДЕЛЕЙ ==========');

    const testCatalog = new CatalogModel();

    console.log('--- CatalogModel ---');

    testCatalog.saveProducts(apiProducts.items);
    console.log('Все товары:', testCatalog.getProducts());

    console.log(
        'Найденный товар:',
        testCatalog.findProduct(apiProducts.items[0].id)
    );

    testCatalog.chooseProduct(apiProducts.items[0]);
    console.log('Выбранный товар:', testCatalog.getChosenProduct());

    testCatalog.chooseProduct(null);
    console.log('Выбранный товар после очистки:', testCatalog.getChosenProduct());

    const testBasket = new BasketModel();

    console.log('--- BasketModel ---');

    testBasket.addProduct(apiProducts.items[0]);
    testBasket.addProduct(apiProducts.items[1]);

    console.log('Товары корзины:', testBasket.getProducts());
    console.log('Есть первый товар:', testBasket.hasProduct(apiProducts.items[0].id));
    console.log('Общая стоимость:', testBasket.getTotalPrice());
    console.log('Количество товаров:', testBasket.getProductCount());

    testBasket.addProduct(apiProducts.items[0]);
    console.log('Количество после повторного добавления:', testBasket.getProductCount());

    testBasket.removeProduct(apiProducts.items[0].id);
    console.log('Корзина после удаления:', testBasket.getProducts());

    testBasket.clearBasket();
    console.log('Корзина после очистки:', testBasket.getProducts());

    const testBuyer = new BuyerModel();

    console.log('--- BuyerModel ---');

    console.log('Ошибки пустых данных:', testBuyer.validateBuyerData());

    testBuyer.updateBuyerData({
        payment: TPayment.CARD,
        address: 'Тестовая улица, 10',
        email: 'test@example.com',
        phone: '+375291234567'
    });

    console.log('Данные покупателя:', testBuyer.getBuyerData());
    console.log('Ошибки заполненных данных:', testBuyer.validateBuyerData());

    testBuyer.updateBuyerData({
        address: 'Новый тестовый адрес, 15'
    });

    console.log('Данные после частичного обновления:', testBuyer.getBuyerData());

    testBuyer.clearBuyerData();
    console.log('Данные после очистки:', testBuyer.getBuyerData());

    console.log('========== ТЕСТИРОВАНИЕ ЗАВЕРШЕНО ==========');
}

// Получение обязательного HTML-элемента
function getRequiredElement<T extends HTMLElement>(selector: string): T {
    const element = document.querySelector<T>(selector);

    if (!element) {
        throw new Error(`Не найден элемент: ${selector}`);
    }

    return element;
}

const galleryElement = getRequiredElement<HTMLElement>('.gallery');
const modalElement = getRequiredElement<HTMLElement>('#modal-container');

const basketCounter = getRequiredElement<HTMLElement>(
    '.header__basket-counter'
);

const basketButton = getRequiredElement<HTMLButtonElement>(
    '.header__basket'
);

const gallery = new Gallery(galleryElement);
const modal = new Modal(events, modalElement);

let orderForm: OrderForm | null = null;
let contactsForm: ContactsForm | null = null;

// Обновление счётчика корзины
function updateBasketCounter(): void {
    basketCounter.textContent = String(basket.getProductCount());
}

// Отображение результата успешного заказа
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

// Отображение каталога
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

// Открытие карточки товара
function openPreview(product: IProduct): void {
    catalog.chooseProduct(product);

    const previewElement = cloneTemplate<HTMLElement>('#card-preview');
    const preview = new CardPreview(events, previewElement);

    preview.title = product.title;
    preview.price = product.price;
    preview.category = product.category;
    preview.image = product.image;
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

// Отображение корзины
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
            updateBasketCounter();
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

// Открытие формы оплаты и адреса
function openOrder(): void {
    const orderElement = cloneTemplate<HTMLFormElement>('#order');

    orderForm = new OrderForm(events, orderElement);

    const buyerData = buyer.getBuyerData();

    if (buyerData.payment) {
        orderForm.payment = buyerData.payment;
    }

    orderForm.address = buyerData.address || '';

    modal.content = orderForm.render();
    modal.open();
}

// Открытие формы контактных данных
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

// Проверка данных и отправка заказа
async function submitOrder(): Promise<void> {
    const errors = buyer.validateBuyerData();
    const errorMessages = Object.values(errors).filter(Boolean);

    if (errorMessages.length > 0) {
        if (contactsForm) {
            contactsForm.errors = errorMessages.join('. ');
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
        }

        return;
    }

    if (basket.getProductCount() === 0) {
        if (contactsForm) {
            contactsForm.errors = 'Корзина пуста';
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
        updateBasketCounter();

        orderForm = null;
        contactsForm = null;

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

// Обработчики событий интерфейса
events.on('modal:close', () => {
    modal.close();
});

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

    updateBasketCounter();
    modal.close();
});

events.on('order:payment-change', (data: { payment: TPayment }) => {
    buyer.updateBuyerData({
        payment: data.payment
    });
});

events.on('order:address-change', (data: { address: string }) => {
    buyer.updateBuyerData({
        address: data.address
    });
});

events.on('order:submit', () => {
    openContacts();
});

events.on('contacts:email-change', (data: { email: string }) => {
    buyer.updateBuyerData({
        email: data.email
    });
});

events.on('contacts:phone-change', (data: { phone: string }) => {
    buyer.updateBuyerData({
        phone: data.phone
    });
});

events.on('contacts:submit', () => {
    void submitOrder();
});

// Открытие корзины
basketButton.addEventListener('click', () => {
    openBasket();
});

// Запуск приложения
testModels();
updateBasketCounter();

apiService.getProducts()
    .then((response) => {
        catalog.saveProducts(response.items);
        renderCatalog(catalog.getProducts());

        console.log('Каталог загружен:', response.total);
    })
    .catch((error: unknown) => {
        console.error('Ошибка загрузки каталога:', error);
    });
