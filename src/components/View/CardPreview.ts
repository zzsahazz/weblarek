import { Card } from './Card';
import { IEvents } from '../base/Events';
import { TCardPreview } from '../../types';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';

export class CardPreview extends Card<TCardPreview> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(
        protected events: IEvents,
        container: HTMLElement
    ) {
        super(container);

        this.categoryElement = ensureElement<HTMLElement>(
            '.card__category',
            this.container
        );

        this.imageElement = ensureElement<HTMLImageElement>(
            '.card__image',
            this.container
        );

        this.descriptionElement = ensureElement<HTMLElement>(
            '.card__text',
            this.container
        );

        this.buttonElement = ensureElement<HTMLButtonElement>(
            '.card__button',
            this.container
        );

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('preview:button-click');
        });
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

    set image(value: { src: string; alt: string }) {
        this.setImage(
            this.imageElement,
            value.src,
            value.alt
        );
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set buttonText(value: string) {
        this.buttonElement.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        this.buttonElement.disabled = value;
    }
}
