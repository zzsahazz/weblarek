import { IApi, IProducts, IOrder, IOrderResult } from '../types';

export class ApiService {
    constructor(protected api: IApi) {}

    getProducts(): Promise<IProducts> {
        return this.api.get<IProducts>('/product/');
    }

    createOrder(order: IOrder): Promise<IOrderResult> {
        return this.api.post<IOrderResult>('/order/', order);
    }
}