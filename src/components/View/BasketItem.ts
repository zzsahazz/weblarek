import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { settings } from '../../utils/constants';

export interface IBasketItem {
    index: number;
    title: string;
    price: number | null;
}

export class BasketItem extends Component<IBasketItem> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        onDelete: () => void
    ) {
        super(container);

        this.titleElement = ensureElement<HTMLElement>('.card__title',this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price',this.container);
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index',this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete',this.container);
        this.deleteButton.addEventListener('click', onDelete);
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }
    set price(value: number | null) {
        this.priceElement.textContent = value === null
            ? settings.pricelessText
            : `${value} ${settings.currency}`;
    }
    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}