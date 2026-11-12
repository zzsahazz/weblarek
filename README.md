# Проектная работа «Веб-ларёк»

## Описание проекта

«Веб-ларёк» — интернет-магазин, в котором пользователь может просматривать каталог товаров, открывать карточки с подробной информацией, добавлять товары в корзину и оформлять заказ.

Проект реализован с использованием архитектурного подхода **MVP (Model–View–Presenter)** и событийной модели взаимодействия между компонентами.

## Технологии

- HTML5
- SCSS
- TypeScript
- Vite

## Функциональность

- Загрузка каталога товаров с сервера.
- Отображение карточек товаров.
- Просмотр подробной информации о товаре.
- Добавление и удаление товаров из корзины.
- Отображение количества товаров в корзине.
- Подсчёт общей стоимости заказа.
- Выбор способа оплаты.
- Указание адреса доставки.
- Ввод контактных данных: email и телефон.
- Проверка заполненности обязательных полей.
- Отправка заказа на сервер.
- Отображение окна успешного оформления заказа.

## Установка и запуск проекта

### 1. Клонирование репозитория

```bash
git clone https://github.com/zzsahazz/weblarek.git
```

### 2. Переход в папку проекта

```bash
cd weblarek
```

### 3. Установка зависимостей

```bash
npm install
```

### 4. Настройка переменных окружения

В корне проекта необходимо создать файл `.env` и указать адрес API:

```env
VITE_API_ORIGIN=https://larek.ffapi.ru
```

### 5. Запуск проекта в режиме разработки

```bash
npm run dev
```

После запуска приложение будет доступно по адресу, который укажет Vite в терминале (обычно http://localhost:5173/).

### 6. Сборка проекта

```bash
npm run build
```

Собранная версия проекта будет находиться в папке `dist`.

## Архитектура проекта

В проекте используется архитектура **MVP (Model–View–Presenter)**.

- **Model** — отвечает за хранение и изменение данных приложения.
- **View** — отвечает за отображение данных и взаимодействие с пользователем.
- **Presenter** — связывает Model и View, обрабатывает события и управляет логикой приложения.

Для взаимодействия компонентов используется класс `EventEmitter`, реализующий событийную модель.

Модели изменяют своё состояние и генерируют события. Presenter подписывается на эти события, получает актуальные данные через методы моделей и обновляет представление.

## Структура проекта

```text
src/
├── components/
│   ├── base/
│   │   ├── Api.ts
│   │   ├── Component.ts
│   │   └── Events.ts
│   │
│   ├── Models/
│   │   ├── BasketModel.ts
│   │   ├── BuyerModel.ts
│   │   └── CatalogModel.ts
│   │
│   ├── View/
│   │   ├── BasketItem.ts
│   │   ├── BasketView.ts
│   │   ├── Card.ts
│   │   ├── CardCatalog.ts
│   │   ├── CardPreview.ts
│   │   ├── ContactsForm.ts
│   │   ├── Gallery.ts
│   │   ├── Header.ts
│   │   ├── Modal.ts
│   │   ├── OrderForm.ts
│   │   └── Success.ts
│   │
│   └── ApiService.ts
│
├── utils/
│   ├── constants.ts
│   ├── data.ts
│   └── utils.ts
│
├── types/
│   └── index.ts
│
├── common.blocks/
│
└── main.ts
```

## Типы данных

Основные интерфейсы и типы проекта находятся в файле `src/types/index.ts`.

### ApiPostMethods

Тип HTTP-методов, используемых при отправке запросов:

```ts
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
```

### IApi

Интерфейс базового API-клиента. Описывает методы для получения и отправки данных:

```ts
export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(
        uri: string,
        data: object,
        method?: ApiPostMethods
    ): Promise<T>;
}
```

### IProduct

Интерфейс товара каталога:

```ts
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}
```

### TPayment

Перечисление способов оплаты:

```ts
export enum TPayment {
    CARD = 'card',
    CASH = 'cash',
}
```

### IBuyer

Интерфейс данных покупателя:

```ts
export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}
```

### TBuyerData

Тип данных покупателя, используемый моделью до выбора способа оплаты. Поле `payment` может содержать пустую строку:

```ts
export type TBuyerData = Omit<IBuyer, 'payment'> & {
    payment: TPayment | '';
};
```

### BuyerErrors

Тип ошибок валидации данных покупателя. Каждое поле содержит сообщение об ошибке или отсутствует:

```ts
export type BuyerErrors = Partial<Record<keyof IBuyer, string>>;
```

### IProducts

Интерфейс ответа сервера со списком товаров:

```ts
export interface IProducts {
    items: IProduct[];
    total: number;
}
```

### IOrder

Интерфейс данных оформленного заказа, отправляемого на сервер:

```ts
export interface IOrder {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}
```

### IOrderResult

Интерфейс результата оформления заказа:

```ts
export interface IOrderResult {
    id: string;
    total: number;
}
```

### ICard

Общие свойства карточек товаров:

```ts
export interface ICard {
    title: string;
    price: number | null;
}
```

### ICardImage

Интерфейс данных изображения карточки:

```ts
export interface ICardImage {
    src: string;
    alt: string;
}
```

### TCard

Дополнительные необязательные свойства карточки:

```ts
export type TCard = ICard & {
    category?: string;
    image?: string;
    description?: string;
};
```

### TCardCatalog

Тип данных карточки товара в каталоге:

```ts
export type TCardCatalog = TCard & Pick<IProduct, 'category' | 'image'>;
```

### TCardPreview

Тип данных карточки предварительного просмотра товара:

```ts
export type TCardPreview = Omit<TCardCatalog, 'image'> & {
    image: ICardImage;
    description: string;
    buttonText: string;
    buttonDisabled: boolean;
};
```

### IBasketItem

Интерфейс данных элемента корзины:

```ts
export interface IBasketItem {
    index: number;
}
```

### ICardActions

Интерфейс действий карточки:

```ts
export interface ICardActions {
    onClick?: () => void;
}
```

## Базовые классы

### Api.ts

Класс `Api` отвечает за базовое взаимодействие с сервером.

Основные возможности:

- отправка HTTP-запросов;
- получение данных;
- отправка данных на сервер;
- обработка ответов сервера.

### Component.ts

Базовый абстрактный класс для компонентов представления.

Предоставляет общие методы для работы с DOM-элементами и их отображения.

Основные элементы:

- `container: HTMLElement` — DOM-элемент компонента.

Основные методы:

- `render(data?: Partial<T>): HTMLElement` — обновляет данные компонента и возвращает его DOM-элемент.

### Events.ts

Содержит интерфейс `IEvents` и класс `EventEmitter`.

`EventEmitter` реализует событийную модель приложения и предоставляет методы:

- `on(eventName: string, callback: Function): void` — подписка на событие;
- `off(eventName: string, callback: Function): void` — отписка от события;
- `emit(eventName: string, data?: object): void` — генерация события;
- `trigger(eventName: string, context?: object): (data: object) => void` — создание обработчика события.

## Модели данных (Model)

### CatalogModel.ts

Модель каталога товаров.

Хранит список товаров и выбранный для предварительного просмотра товар.

**Поля:**

- `productList: IProduct[]` — массив товаров каталога;
- `chosenProduct: IProduct | null` — выбранный товар или `null`, если товар не выбран;
- `events: IEvents` — объект для генерации событий.

**Конструктор:**

```ts
constructor(events: IEvents)
```

**Методы:**

- `saveProducts(products: IProduct[]): void` — сохраняет список товаров и генерирует событие `catalog:changed`;
- `getProducts(): IProduct[]` — возвращает копию массива товаров;
- `findProduct(productId: string): IProduct | undefined` — ищет товар по идентификатору;
- `chooseProduct(product: IProduct | null): void` — устанавливает выбранный товар и генерирует событие `preview:changed`;
- `getChosenProduct(): IProduct | null` — возвращает выбранный товар.

**Генерируемые события:**

- `catalog:changed` — список товаров изменён;
- `preview:changed` — выбранный товар изменён.

### BasketModel.ts

Модель корзины.

Отвечает за хранение товаров, добавление и удаление товаров, подсчёт количества и общей стоимости заказа.

**Поля:**

- `basketProducts: IProduct[]` — массив товаров в корзине;
- `events: IEvents` — объект для генерации событий.

**Конструктор:**

```ts
constructor(events: IEvents)
```

**Методы:**

- `getProducts(): IProduct[]` — возвращает копию массива товаров корзины;
- `addProduct(product: IProduct): void` — добавляет товар в корзину, если его там ещё нет;
- `removeProduct(productId: string): void` — удаляет товар по идентификатору;
- `clearBasket(): void` — очищает корзину;
- `getTotalPrice(): number` — возвращает общую стоимость товаров;
- `getProductCount(): number` — возвращает количество товаров;
- `hasProduct(productId: string): boolean` — проверяет наличие товара в корзине.

**Генерируемое событие:**

- `basket:changed` — содержимое корзины изменено.

Событие генерируется при фактическом изменении содержимого корзины.

### BuyerModel.ts

Модель данных покупателя.

Отвечает за хранение контактных данных и информации о доставке.

**Поля:**

- `paymentMethod: TPayment | ''` — выбранный способ оплаты;
- `deliveryAddress: string` — адрес доставки;
- `emailAddress: string` — электронная почта покупателя;
- `phoneNumber: string` — номер телефона покупателя;
- `events: IEvents` — объект для генерации событий.

**Конструктор:**

```ts
constructor(events: IEvents)
```

**Методы:**

- `updateBuyerData(data: Partial<TBuyerData>): void` — обновляет переданные данные покупателя;
- `getBuyerData(): TBuyerData` — возвращает текущие данные покупателя;
- `clearBuyerData(): void` — очищает данные покупателя;
- `validateBuyerData(): BuyerErrors` — проверяет заполненность обязательных полей и возвращает объект ошибок валидации.

Проверяются следующие данные:

- выбран ли способ оплаты;
- указан ли адрес доставки;
- заполнен ли email;
- заполнен ли телефон.

**Генерируемое событие:**

- `buyer:changed` — данные покупателя изменены.

## Сервис API

### ApiService.ts

Класс `ApiService` отвечает за взаимодействие приложения с сервером на уровне бизнес-операций.

**Поле:**

- `api: IApi` — экземпляр базового API-клиента.

**Конструктор:**

```ts
constructor(api: IApi)
```

**Методы:**

- `getProducts(): Promise<IProducts>` — получает с сервера список товаров;
- `createOrder(order: IOrder): Promise<IOrderResult>` — отправляет заказ на сервер и возвращает результат оформления заказа.

Для выполнения запросов используется базовый класс `Api`.

## Компоненты представления (View)

### Card.ts

Базовый класс карточки товара.

Содержит общую логику отображения названия и цены товара.

**Поля:**

- `titleElement: HTMLElement` — DOM-элемент названия товара;
- `priceElement: HTMLElement` — DOM-элемент цены товара.

**Конструктор:**

```ts
constructor(container: HTMLElement)
```

**Сеттеры:**

- `title: string` — устанавливает название товара;
- `price: number | null` — устанавливает цену товара. Если цена отсутствует (`null`), отображается соответствующее значение.

### CardCatalog.ts

Компонент карточки товара в каталоге.

Отображает основную информацию о товаре.

**Поля:**

- `categoryElement: HTMLElement` — DOM-элемент категории товара;
- `imageElement: HTMLImageElement` — DOM-элемент изображения товара.

**Конструктор:**

```ts
constructor(container: HTMLElement, actions?: ICardActions)
```

**Сеттеры:**

- `category: string` — устанавливает категорию товара и соответствующий CSS-класс;
- `image: string` — устанавливает изображение товара.

При нажатии на карточку вызывается переданный обработчик `actions.onClick`. В `main.ts` этот обработчик генерирует событие `card:select`.

### CardPreview.ts

Компонент предварительного просмотра товара.

Отображает подробную информацию о выбранном товаре, изображение, описание и кнопку добавления или удаления товара из корзины.

**Поля:**

- `events: IEvents` — объект для генерации событий;
- `categoryElement: HTMLElement` — DOM-элемент категории товара;
- `imageElement: HTMLImageElement` — DOM-элемент изображения;
- `descriptionElement: HTMLElement` — DOM-элемент описания товара;
- `buttonElement: HTMLButtonElement` — кнопка действия с товаром.

**Конструктор:**

```ts
constructor(events: IEvents, container: HTMLElement)
```

**Сеттеры:**

- `category: string` — устанавливает категорию товара;
- `image: ICardImage` — устанавливает изображение и альтернативный текст;
- `description: string` — устанавливает описание товара;
- `buttonText: string` — устанавливает текст кнопки;
- `buttonDisabled: boolean` — управляет доступностью кнопки.

При нажатии на кнопку генерирует событие `preview:button-click`.

### Gallery.ts

Компонент галереи товаров.

Отвечает за отображение переданного списка карточек каталога.

**Поля:**

- `catalog: HTMLElement[]` — массив DOM-элементов карточек каталога.

**Конструктор:**

```ts
constructor(container: HTMLElement)
```

**Сеттеры:**

- `catalog: HTMLElement[]` — устанавливает список карточек и обновляет содержимое галереи.

### Header.ts

Компонент шапки сайта.

Отображает количество товаров в корзине.

**Поля:**

- `counterElement: HTMLElement` — DOM-элемент счётчика товаров;
- `basketButton: HTMLButtonElement` — кнопка открытия корзины;
- `events: IEvents` — объект для генерации событий.

**Конструктор:**

```ts
constructor(container: HTMLElement, events: IEvents)
```

**Сеттеры:**

- `counter: number` — устанавливает количество товаров в корзине.

При нажатии на кнопку открытия корзины генерирует событие `basket:open`.

### BasketItem.ts

Компонент отдельного товара в корзине.

Отображает название, цену, порядковый номер и кнопку удаления товара.

**Поля:**

- `indexElement: HTMLElement` — DOM-элемент порядкового номера;
- `deleteButton: HTMLButtonElement` — кнопка удаления товара.

**Конструктор:**

```ts
constructor(container: HTMLElement, actions?: ICardActions)
```

**Сеттеры:**

- `index: number` — устанавливает порядковый номер товара.

При нажатии на кнопку удаления вызывается переданный обработчик `actions.onClick`. В `main.ts` этот обработчик генерирует событие `basket:delete`, передавая объект товара типа `IProduct`.

### BasketView.ts

Компонент отображения корзины.

Отвечает за:

- отображение списка товаров;
- отображение общей стоимости;
- управление доступностью кнопки оформления заказа.

**Поля:**

- `items: HTMLElement[]` — массив DOM-элементов товаров корзины;
- `total: number` — общая стоимость товаров;
- `orderDisabled: boolean` — состояние доступности кнопки оформления заказа.

**Конструктор:**

```ts
constructor(container: HTMLElement, events: IEvents)
```

**Сеттеры:**

- `items: HTMLElement[]` — устанавливает список товаров в корзине;
- `total: number` — устанавливает общую стоимость товаров;
- `orderDisabled: boolean` — управляет доступностью кнопки оформления заказа.

При нажатии на кнопку оформления заказа генерирует событие `basket:order`.

### Modal.ts

Компонент модального окна.

Отвечает за отображение и закрытие модального окна.

**Поля:**

- `closeButton: HTMLButtonElement` — кнопка закрытия модального окна;
- `contentElement: HTMLElement` — DOM-элемент содержимого модального окна.

**Конструктор:**

```ts
constructor(container: HTMLElement)
```

**Сеттеры:**

- `content: HTMLElement` — устанавливает содержимое модального окна.

**Методы:**

- `open(): void` — открывает модальное окно;
- `close(): void` — закрывает модальное окно.

Модальное окно закрывается при нажатии на кнопку закрытия, нажатии на область фона за пределами содержимого или клавишу Escape.

### Form.ts

Базовый абстрактный класс форм.

Отвечает за общую логику работы форм:

- обработку отправки формы;
- управление доступностью кнопки отправки;
- отображение ошибок валидации.

**Поля:**

- `submitButton: HTMLButtonElement` — кнопка отправки формы;
- `errorsElement: HTMLElement` — DOM-элемент для отображения ошибок.

**Конструктор:**

```ts
constructor(container: HTMLFormElement, onSubmit: () => void)
```

**Сеттеры:**

- `valid: boolean` — управляет доступностью кнопки отправки формы;
- `errors: string` — устанавливает текст ошибок валидации.

### OrderForm.ts

Компонент первой формы оформления заказа.

Отображает способы оплаты и поле для ввода адреса доставки.

**Поля:**

- `events: IEvents` — объект для генерации событий;
- `cardButton: HTMLButtonElement` — кнопка выбора оплаты картой;
- `cashButton: HTMLButtonElement` — кнопка выбора оплаты наличными;
- `addressInput: HTMLInputElement` — поле ввода адреса доставки.

**Конструктор:**

```ts
constructor(events: IEvents, container: HTMLFormElement)
```

**Сеттеры:**

- `address: string` — устанавливает адрес доставки;
- `payment: TPayment | ''` — устанавливает выбранный способ оплаты.

**Генерируемые события:**

- `order:payment-change` — изменён способ оплаты. Передаёт объект `{ payment: TPayment }`;
- `order:address-change` — изменён адрес доставки. Передаёт объект `{ address: string }`;
- `order:submit` — отправлена первая форма.

### ContactsForm.ts

Компонент формы контактных данных.

Содержит поля для ввода email и телефона.

**Поля:**

- `events: IEvents` — объект для генерации событий;
- `emailInput: HTMLInputElement` — поле ввода электронной почты;
- `phoneInput: HTMLInputElement` — поле ввода телефона.

**Конструктор:**

```ts
constructor(events: IEvents, container: HTMLFormElement)
```

**Сеттеры:**

- `email: string` — устанавливает email покупателя;
- `phone: string` — устанавливает номер телефона покупателя.

**Генерируемые события:**

- `contacts:email-change` — изменён email. Передаёт объект `{ email: string }`;
- `contacts:phone-change` — изменён телефон. Передаёт объект `{ phone: string }`;
- `contacts:submit` — отправлена форма контактных данных.

### Success.ts

Компонент окна успешного оформления заказа.

Отображает сообщение об успешном оформлении заказа и итоговую сумму.

**Поля:**

- `descriptionElement: HTMLElement` — DOM-элемент с информацией о результате заказа;
- `closeButton: HTMLButtonElement` — кнопка закрытия окна;
- `events: IEvents` — объект для генерации событий.

**Конструктор:**

```ts
constructor(container: HTMLElement, events: IEvents)
```

**Сеттеры:**

- `total: number` — устанавливает итоговую сумму заказа.

При нажатии на кнопку закрытия генерирует событие `success:close`.

## События приложения

Для взаимодействия между моделями данных, компонентами представления и Presenter используется событийная модель на основе класса `EventEmitter`.

События делятся на две группы:

- события моделей — генерируются при изменении данных приложения;
- события представлений — генерируются в ответ на действия пользователя.

События моделей генерируются без передачи дополнительных данных. После получения уведомления Presenter самостоятельно запрашивает актуальное состояние моделей через соответствующие методы.

### События моделей

| Событие | Модель | Условие генерации |
|---|---|---|
| `catalog:changed` | `CatalogModel` | После сохранения списка товаров методом `saveProducts()` |
| `preview:changed` | `CatalogModel` | После изменения выбранного товара методом `chooseProduct()` |
| `basket:changed` | `BasketModel` | После добавления, удаления или очистки корзины, если её содержимое изменилось |
| `buyer:changed` | `BuyerModel` | После обновления или очистки данных покупателя |

### События представлений

| Событие | Компонент | Описание и передаваемые данные |
|---|---|---|
| `card:select` | `CardCatalog` | Выбор карточки товара. В Presenter передаётся объект `IProduct` |
| `preview:button-click` | `CardPreview` | Нажатие на кнопку добавления или удаления товара из корзины |
| `basket:open` | `Header` | Нажатие на кнопку открытия корзины |
| `basket:delete` | `BasketItem` | Нажатие на кнопку удаления товара. В Presenter передаётся объект `IProduct` |
| `basket:order` | `BasketView` | Нажатие на кнопку оформления заказа |
| `order:payment-change` | `OrderForm` | Изменение способа оплаты. Передаёт `{ payment: TPayment }` |
| `order:address-change` | `OrderForm` | Изменение адреса доставки. Передаёт `{ address: string }` |
| `order:submit` | `OrderForm` | Отправка первой формы оформления заказа |
| `contacts:email-change` | `ContactsForm` | Изменение email. Передаёт `{ email: string }` |
| `contacts:phone-change` | `ContactsForm` | Изменение телефона. Передаёт `{ phone: string }` |
| `contacts:submit` | `ContactsForm` | Отправка формы контактных данных |
| `success:close` | `Success` | Нажатие на кнопку закрытия окна успешного оформления заказа |

## Презентер (Presenter)

Презентер реализован в файле `src/main.ts`.

В проекте используется событийный подход: Presenter подписывается на события через `EventEmitter`, получает данные из моделей и передаёт их компонентам представления. Компоненты View сообщают о действиях пользователя через события, а Presenter обрабатывает их и вызывает необходимые методы моделей.

### Основные функции Presenter

**`renderCatalog(): void`**

- Получает список товаров через `catalog.getProducts()`.
- Создаёт карточки каталога `CardCatalog`.
- Передаёт карточкам данные о названии, цене, категории и изображении.
- Устанавливает созданные карточки в галерею через `gallery.catalog`.

**`renderBasket(): void`**

- Получает товары корзины через `basket.getProducts()`.
- Создаёт элементы корзины `BasketItem`.
- Передаёт каждому элементу название, цену и порядковый номер.
- Обновляет отображение корзины через `basketView.render()`.
- Передаёт общую стоимость и состояние доступности кнопки оформления заказа.

**`openBasket(): void`**

- Отображает корзину в модальном окне.
- Открывает модальное окно через `modal.open()`.

**`openOrder(): void`**

- Отображает первую форму оформления заказа.
- Открывает модальное окно.

**`openContacts(): void`**

- Отображает форму контактных данных.
- Открывает модальное окно.

**`updateForms(): void`**

- Получает данные покупателя через `buyer.getBuyerData()`.
- Проверяет обязательные поля через `buyer.validateBuyerData()`.
- Формирует сообщения об ошибках для каждой формы.
- Обновляет значения полей, состояние кнопок отправки и сообщения об ошибках.

**`submitOrder(): Promise<void>`**

- Проверяет данные покупателя.
- Получает актуальные данные покупателя и товары корзины.
- Формирует объект заказа типа `IOrder`.
- Отправляет заказ через `apiService.createOrder(order)`.
- При успешном ответе очищает корзину и данные покупателя.
- Отображает окно успешного оформления заказа.
- При ошибке выводит сообщение о невозможности оформить заказ.

### Обработка событий в Presenter

Presenter подписывается на события через `EventEmitter` и выполняет соответствующие действия:

| Событие | Действие Presenter |
|---|---|
| `catalog:changed` | Вызывает `renderCatalog()`, получает список товаров через `catalog.getProducts()` и обновляет каталог |
| `preview:changed` | Получает выбранный товар через `catalog.getChosenProduct()`, формирует данные карточки предварительного просмотра и открывает модальное окно |
| `basket:changed` | Обновляет счётчик товаров в шапке и отображение корзины через `renderBasket()` |
| `buyer:changed` | Вызывает `updateForms()`, проверяет данные покупателя и обновляет формы |
| `card:select` | Передаёт выбранный товар в `catalog.chooseProduct(product)`, после чего модель генерирует `preview:changed` |
| `preview:button-click` | Добавляет товар в корзину или удаляет его из неё |
| `basket:open` | Вызывает `openBasket()` для открытия корзины |
| `basket:delete` | Получает объект `IProduct` и удаляет товар через `basket.removeProduct(product.id)` |
| `basket:order` | Вызывает `openOrder()` для перехода к первой форме оформления заказа |
| `order:payment-change` | Обновляет способ оплаты в `BuyerModel` через `buyer.updateBuyerData()` |
| `order:address-change` | Обновляет адрес доставки в `BuyerModel` |
| `order:submit` | Вызывает `openContacts()` для перехода к форме контактных данных |
| `contacts:email-change` | Обновляет email в `BuyerModel` |
| `contacts:phone-change` | Обновляет телефон в `BuyerModel` |
| `contacts:submit` | Запускает отправку заказа методом `submitOrder()` |
| `success:close` | Закрывает модальное окно через `modal.close()` |

### Передача данных через события

События моделей `catalog:changed`, `preview:changed`, `basket:changed` и `buyer:changed` генерируются без передачи дополнительных данных.

После получения таких событий Presenter обращается к соответствующей модели и получает актуальные данные через её методы.

События представлений могут передавать дополнительные данные, необходимые для обработки действий пользователя.

Например:

- `card:select` передаёт объект товара типа `IProduct`;
- `basket:delete` передаёт объект товара типа `IProduct`, после чего Presenter использует его `id` для удаления;
- `order:payment-change` передаёт объект `{ payment: TPayment }`;
- `order:address-change` передаёт объект `{ address: string }`;
- `contacts:email-change` передаёт объект `{ email: string }`;
- `contacts:phone-change` передаёт объект `{ phone: string }`.

### Первоначальная инициализация приложения

При запуске приложения в `src/main.ts` выполняются следующие действия:

1. Создаётся экземпляр `EventEmitter`.
2. Создаются модели `CatalogModel`, `BasketModel` и `BuyerModel`.
3. Создаются экземпляры `Api` и `ApiService`.
4. Получаются основные DOM-элементы страницы.
5. Создаются компоненты представления: `Gallery`, `Header`, `Modal`, `CardPreview`, `BasketView`, `OrderForm`, `ContactsForm` и `Success`.
6. Выполняется начальная очистка корзины и данных покупателя.
7. Устанавливается начальное значение счётчика товаров в шапке.
8. Отображается пустая корзина через `renderBasket()`.
9. Через `apiService.getProducts()` загружается каталог товаров с сервера.
10. После успешной загрузки товары сохраняются в `CatalogModel` методом `catalog.saveProducts()`, который генерирует событие `catalog:changed`. Presenter обрабатывает это событие и отображает каталог.

Таким образом, `main.ts` связывает модели и компоненты представления, обрабатывает события приложения и управляет последовательностью действий пользователя.