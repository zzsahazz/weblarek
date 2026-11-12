
import './scss/styles.scss';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';

import { CatalogModel } from './components/Models/CatalogModel';
import { BasketModel } from './components/Models/BasketModel';
import { BuyerModel } from './components/Models/BuyerModel';

import { ApiService } from './components/ApiService';

import { Gallery } from './components/View/Gallery';
import { Header } from './components/View/Header';
import { Modal } from './components/View/Modal';
import { CardCatalog } from './components/View/CardCatalog';
import { CardPreview } from './components/View/CardPreview';
import { BasketItem } from './components/View/BasketItem';
import { BasketView } from './components/View/BasketView';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { Success } from './components/View/Success';

import { cloneTemplate, ensureElement } from './utils/utils';
import { API_URL, CDN_URL } from './utils/constants';

import { IProduct, IOrder, TPayment } from './types';

// ============================================
// 1. Создание событий, моделей и API
// ============================================

const events = new EventEmitter();

const catalog = new CatalogModel(events);
const basket = new BasketModel(events);
const buyer = new BuyerModel(events);

const api = new Api(API_URL);
const apiService = new ApiService(api);

// ============================================
// 2. Получение основных элементов страницы
// ============================================

const galleryElement = ensureElement<HTMLElement>('.gallery');
const headerElement = ensureElement<HTMLElement>('.header');
const modalElement = ensureElement<HTMLElement>('#modal-container');

// ============================================
// 3. Создание компонентов представления
// ============================================

const gallery = new Gallery(galleryElement);

const header = new Header(headerElement, events);

const modal = new Modal(modalElement);

const preview = new CardPreview(
    events,
    cloneTemplate<HTMLElement>('#card-preview')
);

const basketView = new BasketView(
    cloneTemplate<HTMLElement>('#basket'),
    events
);

const orderForm = new OrderForm(
    events,
    cloneTemplate<HTMLFormElement>('#order')
);

const contactsForm = new ContactsForm(
    events,
    cloneTemplate<HTMLFormElement>('#contacts')
);

const success = new Success(
    cloneTemplate<HTMLElement>('#success'),
    events
);

// ============================================
// 4. Отображение каталога
// ============================================

function renderCatalog(): void {
    const products = catalog.getProducts();

    const cards = products.map((product) => {
        const card = new CardCatalog(
            cloneTemplate<HTMLElement>('#card-catalog'),
            {
                onClick: () => {
                    events.emit('card:select', product);
                }
            }
        );

        return card.render({
            title: product.title,
            price: product.price,
            category: product.category,
            image: product.image
        });
    });

    gallery.catalog = cards;
}

// ============================================
// 5. Отображение корзины
// ============================================

function renderBasket(): void {
    const products = basket.getProducts();

    const items = products.map((product, index) => {
        const item = new BasketItem(
            cloneTemplate<HTMLElement>('#card-basket'),
            {
                onClick: () => {
                    events.emit('basket:delete', product);
                }
            }
        );

        return item.render({
            title: product.title,
            price: product.price,
            index: index + 1
        });
    });

    basketView.render({
        items,
        total: basket.getTotalPrice(),
        orderDisabled: products.length === 0
    });
}

// ============================================
// 6. Открытие корзины
// ============================================

function openBasket(): void {
    modal.render({
        content: basketView.render()
    });

    modal.open();
}

// ============================================
// 7. Открытие формы заказа
// ============================================

function openOrder(): void {
    modal.render({
        content: orderForm.render()
    });

    modal.open();
}

// ============================================
// 8. Открытие формы контактных данных
// ============================================

function openContacts(): void {
    modal.render({
        content: contactsForm.render()
    });

    modal.open();
}

// ============================================
// 9. Обновление форм и валидация
// ============================================

function updateForms(): void {
    const buyerData = buyer.getBuyerData();
    const errors = buyer.validateBuyerData();

    const orderErrors = [
        errors.payment,
        errors.address
    ].filter(Boolean).join('. ');

    const contactsErrors = [
        errors.email,
        errors.phone
    ].filter(Boolean).join('. ');

    orderForm.render({
        payment: buyerData.payment,
        address: buyerData.address,
        errors: orderErrors,
        valid: !errors.payment && !errors.address
    });

    contactsForm.render({
        email: buyerData.email,
        phone: buyerData.phone,
        errors: contactsErrors,
        valid: !errors.email && !errors.phone
    });
}

// ============================================
// 10. Отправка заказа
// ============================================

async function submitOrder(): Promise<void> {
    const errors = buyer.validateBuyerData();

    if (Object.keys(errors).length > 0) {
        updateForms();
        return;
    }

    const buyerData = buyer.getBuyerData();

    if (!buyerData.payment) {
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

        // Очищаем модели после успешного ответа сервера
        basket.clearBasket();
        buyer.clearBuyerData();

        // Показываем результат оформления заказа
        modal.render({
            content: success.render({
                total: response.total
            })
        });

        modal.open();

    } catch (error: unknown) {
        console.error('Ошибка оформления заказа:', error);

        const currentBuyerData = buyer.getBuyerData();
        const currentErrors = buyer.validateBuyerData();

        contactsForm.render({
            email: currentBuyerData.email,
            phone: currentBuyerData.phone,
            errors: 'Не удалось оформить заказ. Попробуйте ещё раз.',
            valid: !currentErrors.email && !currentErrors.phone
        });
    }
}

// ============================================
// 11. Подписки на события
// ============================================

// Изменение каталога
events.on('catalog:changed', () => {
    renderCatalog();
});

// Выбор товара и отображение подробной карточки
events.on('preview:changed', () => {
    const product = catalog.getChosenProduct();

    if (!product) {
        return;
    }

    const alreadyInBasket = basket.hasProduct(product.id);

    let buttonText = 'Купить';
    let buttonDisabled = false;

    if (product.price === null) {
        buttonText = 'Недоступно';
        buttonDisabled = true;
    } else if (alreadyInBasket) {
        buttonText = 'Удалить из корзины';
    }

    modal.render({
        content: preview.render({
            title: product.title,
            price: product.price,
            category: product.category,
            image: {
                src: CDN_URL + product.image,
                alt: product.title
            },
            description: product.description,
            buttonText,
            buttonDisabled
        })
    });

    modal.open();
});

// Изменение корзины
events.on('basket:changed', () => {
    header.counter = basket.getProductCount();
    renderBasket();
});

// Изменение данных покупателя
events.on('buyer:changed', () => {
    updateForms();
});

// Выбор карточки товара
events.on('card:select', (product: IProduct) => {
    catalog.chooseProduct(product);
});

// Открытие корзины
events.on('basket:open', () => {
    openBasket();
});

// Удаление товара из корзины
events.on('basket:delete', (product: IProduct) => {
    basket.removeProduct(product.id);
});

// Переход к оформлению заказа
events.on('basket:order', () => {
    openOrder();
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

// Изменение адреса доставки
events.on('order:address-change', (data: { address: string }) => {
    buyer.updateBuyerData({
        address: data.address
    });
});

// Отправка первой формы
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

// Отправка контактных данных
events.on('contacts:submit', () => {
    void submitOrder();
});

// Закрытие окна успешного заказа
events.on('success:close', () => {
    modal.close();
});

// ============================================
// 12. Первоначальная инициализация приложения
// ============================================

// Сбрасываем начальное состояние моделей
basket.clearBasket();
buyer.clearBuyerData();

// Устанавливаем начальный счётчик
header.counter = basket.getProductCount();

// Первоначальное отображение пустой корзины
renderBasket();

// Загружаем каталог товаров
apiService.getProducts()
    .then((response) => {
        catalog.saveProducts(response.items);
    })
    .catch((error: unknown) => {
        console.error('Ошибка загрузки каталога:', error);
    });
