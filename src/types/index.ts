
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;

    post<T extends object>(
        uri: string,
        data: object,
        method?: ApiPostMethods
    ): Promise<T>;
}

// Способ оплаты
export type TPayment = 'card' | 'cash';

// Данные товара
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

// Данные покупателя
export interface IBuyer {
    payment: TPayment | '';
    email: string;
    phone: string;
    address: string;
}

// Ошибки валидации покупателя
export type BuyerErrors = Partial<Record<keyof IBuyer, string>>;

// Ответ сервера с каталогом товаров
export interface IProducts {
    items: IProduct[];
    total: number;
}

// Данные заказа для отправки на сервер
export interface IOrder {
    payment: TPayment | '';
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

// Ответ сервера после оформления заказа
export interface IOrderResult {
    id: string;
    total: number;
}

// Типы карточек из стартового набора
export type TCard = Pick<IProduct, 'title' | 'price'> & {
    category?: string;
    image?: string;
    description?: string;
};

export type TCardCatalog = TCard & Pick<IProduct, 'category' | 'image'>;

export interface ICardActions {
    onClick?: () => void;
}
