
import { IProduct } from '../../types';

export class BasketModel {
    protected basketProducts: IProduct[] = [];

    // Получение товаров корзины
    getProducts(): IProduct[] {
        return this.basketProducts;
    }

    // Добавление товара в корзину
    addProduct(product: IProduct): void {
        if (!this.hasProduct(product.id)) {
            this.basketProducts.push(product);
        }
    }

    // Удаление товара из корзины по ID
    removeProduct(productId: string): void {
        this.basketProducts = this.basketProducts.filter(
            (product) => product.id !== productId
        );
    }

    // Очистка корзины
    clearBasket(): void {
        this.basketProducts = [];
    }

    // Получение общей стоимости товаров
    getTotalPrice(): number {
        return this.basketProducts.reduce(
            (total, product) => total + (product.price ?? 0),
            0
        );
    }

    // Получение количества товаров
    getProductCount(): number {
        return this.basketProducts.length;
    }

    // Проверка наличия товара по ID
    hasProduct(productId: string): boolean {
        return this.basketProducts.some(
            (product) => product.id === productId
        );
    }
}
