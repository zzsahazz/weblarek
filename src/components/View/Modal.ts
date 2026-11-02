import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class Modal extends Component<{}> {
    protected closeButton: HTMLButtonElement;
    protected contentElement: HTMLElement;

    constructor(
        protected events: IEvents,
        container: HTMLElement
    ) {
        super(container);

        this.closeButton = ensureElement<HTMLButtonElement>(
            '.modal__close',
            this.container
        );

        this.contentElement = ensureElement<HTMLElement>(
            '.modal__content',
            this.container
        );

        // Закрытие по крестику
        this.closeButton.addEventListener('click', () => {
            this.events.emit('modal:close');
        });

        // Закрытие при клике вне содержимого
        this.container.addEventListener('click', (event: MouseEvent) => {
            if (event.target === this.container) {
                this.events.emit('modal:close');
            }
        });

        // Закрытие клавишей Escape
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (
                event.key === 'Escape' &&
                this.container.classList.contains('modal_active')
            ) {
                this.events.emit('modal:close');
            }
        });
    }

    // Установка содержимого модального окна
    set content(element: HTMLElement) {
        this.contentElement.replaceChildren(element);
    }

    // Открытие модального окна
    open(): void {
        this.container.classList.add('modal_active');
        document.body.classList.add('page__wrapper_locked');
    }

    // Закрытие модального окна
    close(): void {
        this.container.classList.remove('modal_active');
        document.body.classList.remove('page__wrapper_locked');
    }
}