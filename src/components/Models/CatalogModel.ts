
import { IProduct } from '../../types';

export class CatalogModel {
    protected productList: IProduct[] = [];
    protected chosenProduct: IProduct | null = null;

    // Сохранение массива товаров
    saveProducts(products: IProduct[]): void {
        this.productList = products;
    }

    // Получение всех товаров
    getProducts(): IProduct[] {
        return this.productList;
    }

    // Поиск товара по ID
    findProduct(productId: string): IProduct | undefined {
        return this.productList.find(
            (product) => product.id === productId
        );
    }

    // Сохранение товара для подробного отображения
    chooseProduct(product: IProduct | null): void {
        this.chosenProduct = product;
    }

    // Получение выбранного товара
    getChosenProduct(): IProduct | null {
        return this.chosenProduct;
    }
}
