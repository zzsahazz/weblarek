import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class CatalogModel {
    protected productList: IProduct[] = [];
    protected chosenProduct: IProduct | null = null;

    constructor(protected eventSystem: IEvents) {}

    saveProducts(products: IProduct[]): void {
        this.productList = products;
        this.eventSystem.emit('catalog:changed');
    }

    getProducts(): IProduct[] {
        return this.productList;
    }

    findProduct(productId: string): IProduct | undefined {
        return this.productList.find(
            (product) => product.id === productId
        );
    }

    chooseProduct(product: IProduct | null): void {
        this.chosenProduct = product;
        this.eventSystem.emit('preview:changed');
    }

    getChosenProduct(): IProduct | null {
        return this.chosenProduct;
    }
}
