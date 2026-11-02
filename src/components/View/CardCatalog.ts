
import { Card } from './Card';
import { ICardActions, TCardCatalog } from '../../types';
import { ensureElement } from '../../utils/utils';
import { categoryMap, CDN_URL } from '../../utils/constants';

/**
 * Карточка товара в каталоге
 */
export class CardCatalog extends Card<TCardCatalog> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.categoryElement = ensureElement<HTMLElement>(
            '.card__category',
            this.container
        );

        this.imageElement = ensureElement<HTMLImageElement>(
            '.card__image',
            this.container
        );

        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        }
    }

    set category(value: string) {
        this.categoryElement.textContent = value;

        for (const [name, modifier] of Object.entries(categoryMap)) {
            this.categoryElement.classList.toggle(
                modifier,
                name === value
            );
        }
    }

    set image(value: string) {
        this.setImage(this.imageElement, CDN_URL + value);
    }
}
