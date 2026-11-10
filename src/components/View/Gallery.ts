
import { Component } from '../base/Component';

export interface IGallery {
    catalog: HTMLElement[];
}

/**
 * Каталог товаров на главной странице
 */
export class Gallery extends Component<IGallery> {
    constructor(container: HTMLElement) {
        super(container);
    }

    set catalog(items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }
}
