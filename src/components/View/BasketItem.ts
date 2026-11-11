
import { Card } from './Card';
import { ensureElement } from '../../utils/utils';
import { IBasketItem } from '../../types';

export class BasketItem extends Card<IBasketItem> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        onDelete: () => void
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

        this.deleteButton.addEventListener('click', onDelete);
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}
