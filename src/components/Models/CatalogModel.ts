
import { IProduct } from '../../types';

export class CatalogModel {
    protected productList: IProduct[] = [];
    protected chosenProduct: IProduct | null = null;

    saveProducts(products: IProduct[]): void {
        this.productList = products;
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
    }

    getChosenProduct(): IProduct | null {
        return this.chosenProduct;
    }
}
