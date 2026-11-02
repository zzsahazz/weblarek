import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class BasketModel {
    protected basketProducts: IProduct[] = [];

    constructor(protected eventSystem: IEvents) {}

    getProducts(): IProduct[] {
        return this.basketProducts;
    }

    addProduct(product: IProduct): void {
        if (!this.hasProduct(product.id)) {
            this.basketProducts.push(product);
            this.eventSystem.emit('basket:changed');
        }
    }

    removeProduct(productId: string): void {
        const oldCount = this.basketProducts.length;

        this.basketProducts = this.basketProducts.filter(
            (product) => product.id !== productId
        );

        if (this.basketProducts.length !== oldCount) {
            this.eventSystem.emit('basket:changed');
        }
    }

    clearBasket(): void {
        if (this.basketProducts.length > 0) {
            this.basketProducts = [];
            this.eventSystem.emit('basket:changed');
        }
    }

    getTotalPrice(): number {
        return this.basketProducts.reduce(
            (total, product) => total + (product.price ?? 0),
            0
        );
    }

    getProductCount(): number {
        return this.basketProducts.length;
    }

    hasProduct(productId: string): boolean {
        return this.basketProducts.some(
            (product) => product.id === productId
        );
    }
}
