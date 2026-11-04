
import './scss/styles.scss';

import { Api } from './components/base/Api';

import { CatalogModel } from './components/Models/CatalogModel';
import { BasketModel } from './components/Models/BasketModel';
import { BuyerModel } from './components/Models/BuyerModel';

import { ApiService } from './components/ApiService';

import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

// Создание моделей
const catalog = new CatalogModel();
const basket = new BasketModel();
const buyer = new BuyerModel();

// Создание API-сервиса
const api = new Api(API_URL);
const apiService = new ApiService(api);

// Проверка методов моделей
function testModels(): void {
    console.log('========== ТЕСТИРОВАНИЕ МОДЕЛЕЙ ==========');

    // CatalogModel
    console.log('--- CatalogModel ---');

    catalog.saveProducts(apiProducts.items);

    console.log(
        'Все товары каталога:',
        catalog.getProducts()
    );

    console.log(
        'Поиск существующего товара:',
        catalog.findProduct(apiProducts.items[0].id)
    );

    console.log(
        'Поиск несуществующего товара:',
        catalog.findProduct('unknown-id')
    );

    catalog.chooseProduct(apiProducts.items[0]);

    console.log(
        'Выбранный товар:',
        catalog.getChosenProduct()
    );

    catalog.chooseProduct(null);

    console.log(
        'Выбранный товар после очистки:',
        catalog.getChosenProduct()
    );

    // BasketModel
    console.log('--- BasketModel ---');

    basket.addProduct(apiProducts.items[0]);
    basket.addProduct(apiProducts.items[1]);

    console.log(
        'Товары в корзине:',
        basket.getProducts()
    );

    console.log(
        'Проверка наличия первого товара:',
        basket.hasProduct(apiProducts.items[0].id)
    );

    console.log(
        'Проверка отсутствия товара:',
        basket.hasProduct('unknown-id')
    );

    console.log(
        'Общая стоимость товаров:',
        basket.getTotalPrice()
    );

    console.log(
        'Количество товаров:',
        basket.getProductCount()
    );

    // Проверка повторного добавления
    basket.addProduct(apiProducts.items[0]);

    console.log(
        'Количество после повторного добавления:',
        basket.getProductCount()
    );

    // Проверка удаления
    basket.removeProduct(apiProducts.items[0].id);

    console.log(
        'Корзина после удаления товара:',
        basket.getProducts()
    );

    // Проверка очистки
    basket.clearBasket();

    console.log(
        'Корзина после очистки:',
        basket.getProducts()
    );

    console.log(
        'Количество товаров после очистки:',
        basket.getProductCount()
    );

    console.log(
        'Стоимость после очистки:',
        basket.getTotalPrice()
    );

    // BuyerModel
    console.log('--- BuyerModel ---');

    // Проверка пустых данных
    console.log(
        'Ошибки пустых данных:',
        buyer.validateBuyerData()
    );

    // Заполнение данных покупателя
    buyer.updateBuyerData({
        payment: 'card',
        address: 'Тестовая улица, 10',
        email: 'test@example.com',
        phone: '+375291234567',
    });

    console.log(
        'Данные покупателя:',
        buyer.getBuyerData()
    );

    console.log(
        'Ошибки заполненных данных:',
        buyer.validateBuyerData()
    );

    // Проверка частичного обновления
    buyer.updateBuyerData({
        address: 'Новый тестовый адрес, 15',
    });

    console.log(
        'Данные после частичного обновления:',
        buyer.getBuyerData()
    );

    // Проверка очистки данных
    buyer.clearBuyerData();

    console.log(
        'Данные покупателя после очистки:',
        buyer.getBuyerData()
    );

    console.log(
        'Ошибки после очистки:',
        buyer.validateBuyerData()
    );

    console.log('========== ТЕСТИРОВАНИЕ ЗАВЕРШЕНО ==========');
}

// Запуск проверки моделей
testModels();

// Получение каталога товаров с сервера
apiService.getProducts()
    .then((response) => {
        // Сохранение товаров в модель каталога
        catalog.saveProducts(response.items);

        console.log(
            'Каталог товаров, полученный с сервера:',
            catalog.getProducts()
        );

        console.log(
            'Количество товаров на сервере:',
            response.total
        );
    })
    .catch((error: unknown) => {
        console.error('Ошибка загрузки каталога:', error);
    });
