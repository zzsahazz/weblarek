import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export class BasketView extends Component<IBasketView> {
    protected listElement: HTMLElement;
    protected totalElement: HTMLElement;
    protected orderButton: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        onOrder: () => void
    ) {
        super(container);

        this.listElement = ensureElement<HTMLElement>(
            '.basket__list',
            this.container
        );

        this.totalElement = ensureElement<HTMLElement>(
            '.basket__price',
            this.container
        );

        this.orderButton = ensureElement<HTMLButtonElement>(
            '.basket__button',
            this.container
        );

        this.orderButton.addEventListener('click', onOrder);
    }

    set items(items: HTMLElement[]) {
        if (items.length === 0) {
            this.listElement.textContent = 'Корзина пуста';
        } else {
            this.listElement.replaceChildren(...items);
        }

        this.orderButton.disabled = items.length === 0;
    }

    set total(value: number) {
        this.totalElement.textContent = `${value} синапсов`;
    }
}