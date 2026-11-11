import { Card } from './Card';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { IBasketItem } from '../../types';

export class BasketItem extends Card<IBasketItem> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        protected events: IEvents,
        protected productId: string
    ) {
        super(container);

        this.indexElement = ensureElement<HTMLElement>(
            '.basket__item-index',
            this.container
        );

        this.deleteButton = ensureElement<HTMLButtonElement>(
            '.basket__item-delete',
            this.container
        );

        this.deleteButton.addEventListener('click', () => {
            this.events.emit('basket:delete', {
                productId: this.productId
            });
        });
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}