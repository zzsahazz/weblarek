
import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface ISuccess {
    total: number;
}

export class Success extends Component<ISuccess> {
    protected descriptionElement: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        onClose: () => void
    ) {
        super(container);

        this.descriptionElement = ensureElement<HTMLElement>(
            '.order-success__description',
            this.container
        );

        this.closeButton = ensureElement<HTMLButtonElement>(
            '.order-success__close',
            this.container
        );

        this.closeButton.addEventListener('click', onClose);
    }

    set total(value: number) {
        this.descriptionElement.textContent =
            `Списано ${value} синапсов`;
    }
}
