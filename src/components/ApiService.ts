
import {
    IApi,
    IProducts,
    IOrder,
    IOrderResult,
} from '../types';

export class ApiService {
    constructor(protected api: IApi) {}

    // Получение каталога товаров
    getProducts(): Promise<IProducts> {
        return this.api.get<IProducts>('/product/');
    }

    // Отправка заказа на сервер
    createOrder(order: IOrder): Promise<IOrderResult> {
        return this.api.post<IOrderResult>('/order/', order);
    }
}
