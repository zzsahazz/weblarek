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

        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close',this.container);
        this.contentElement = ensureElement<HTMLElement>('.modal__content',this.container);
        this.closeButton.addEventListener('click', () => {this.events.emit('modal:close');});

        this.container.addEventListener('click', (event: MouseEvent) => {
            if (event.target === this.container) {
                this.events.emit('modal:close');
            }
        });

        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (
                event.key === 'Escape' &&
                this.container.classList.contains('modal_active')
            ) {
                this.events.emit('modal:close');
            }
        });
    }

    set content(element: HTMLElement) {
        this.contentElement.replaceChildren(element);
    }

    open(): void {
        this.container.classList.add('modal_active');
        document.body.classList.add('page__wrapper_locked');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        document.body.classList.remove('page__wrapper_locked');
    }
}