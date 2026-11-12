import { Card } from './Card';
import { ensureElement } from '../../utils/utils';
import { IBasketItem, ICardActions } from '../../types';

export class BasketItem extends Card<IBasketItem> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        actions?: ICardActions
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
            actions?.onClick?.();
        });
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}
