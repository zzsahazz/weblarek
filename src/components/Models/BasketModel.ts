
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class BasketModel {
    protected basketProducts: IProduct[] = [];

    constructor(protected events: IEvents) {}

    getProducts(): IProduct[] {
        return [...this.basketProducts];
    }

    addProduct(product: IProduct): void {
        if (!this.hasProduct(product.id)) {
            this.basketProducts.push(product);

            this.events.emit('basket:changed', {
                products: this.getProducts()
            });
        }
    }

    removeProduct(productId: string): void {
        const previousCount = this.basketProducts.length;

        this.basketProducts = this.basketProducts.filter(
            (product) => product.id !== productId
        );

        if (this.basketProducts.length !== previousCount) {
            this.events.emit('basket:changed', {
                products: this.getProducts()
            });
        }
    }

    clearBasket(): void {
        if (this.basketProducts.length > 0) {
            this.basketProducts = [];

            this.events.emit('basket:changed', {
                products: this.getProducts()
            });
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
