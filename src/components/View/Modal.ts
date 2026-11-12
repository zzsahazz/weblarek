
import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected closeButton: HTMLButtonElement;
    protected contentElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.closeButton = ensureElement<HTMLButtonElement>(
            '.modal__close',
            this.container
        );

        this.contentElement = ensureElement<HTMLElement>(
            '.modal__content',
            this.container
        );

        this.closeButton.addEventListener('click', () => {
            this.close();
        });

        this.container.addEventListener('click', (event: MouseEvent) => {
            if (event.target === this.container) {
                this.close();
            }
        });
    }

    protected handleEscape = (event: KeyboardEvent): void => {
        if (event.key === 'Escape') {
            this.close();
        }
    };

    set content(element: HTMLElement) {
        this.contentElement.replaceChildren(element);
    }

    open(): void {
        this.container.classList.add('modal_active');
        document.addEventListener('keydown', this.handleEscape);
    }

    close(): void {
        this.container.classList.remove('modal_active');
        document.removeEventListener('keydown', this.handleEscape);
    }
}
