import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export interface IFormState {
    errors: string;
    valid: boolean;
}

export abstract class Form<T> extends Component<IFormState & T> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(
        container: HTMLFormElement,
        onSubmit: () => void
    ) {
        super(container);

        this.submitButton = ensureElement<HTMLButtonElement>(
            'button[type="submit"]',
            this.container
        );

        this.errorsElement = ensureElement<HTMLElement>(
            '.form__errors',
            this.container
        );

        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            onSubmit();
        });
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string) {
        this.errorsElement.textContent = value;
    }
}