export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(
        uri: string,
        data: object,
        method?: ApiPostMethods
    ): Promise<T>;
}

export type BuyerErrors = Partial<Record<keyof IBuyer, string>>;

export enum TPayment {
    CARD = 'card',
    CASH = 'cash',
}

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment | ''; 
    email: string;
    phone: string;
    address: string;
}

export interface IProducts {
    items: IProduct[];
    total: number;
}

export interface IOrder {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export interface IOrderResult {
    id: string;
    total: number;
}

export type TCard = Pick<IProduct, 'title' | 'price'> & {
    category?: string;
    image?: string;
    description?: string;
};

export type TCardCatalog = TCard & Pick<IProduct, 'category' | 'image'>;

export interface ICardActions {
    onClick?: () => void;
}
