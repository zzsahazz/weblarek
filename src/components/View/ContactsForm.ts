import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class ContactsForm extends Component<{}> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(
        protected events: IEvents,
        container: HTMLFormElement
    ) {
        super(container);

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]',this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]',this.container);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]',this.container);
        this.errorsElement = ensureElement<HTMLElement>('.form__errors',this.container);

        this.emailInput.addEventListener('input', () => {
            this.events.emit('contacts:email-change', {
            email: this.emailInput.value
            });

            this.updateSubmitButton();
        });

        this.phoneInput.addEventListener('input', () => {
            this.events.emit('contacts:phone-change', {
                phone: this.phoneInput.value
            });

            this.updateSubmitButton();
        });

        this.container.addEventListener('submit', (event) => {
            event.preventDefault();

            if (this.submitButton.disabled) {
                return;
            }

            this.events.emit('contacts:submit');
        });

        this.updateSubmitButton();
    }

    protected updateSubmitButton(): void {
        const hasEmail = this.emailInput.value.trim() !== '';
        const hasPhone = this.phoneInput.value.trim() !== '';

        this.submitButton.disabled = !hasEmail || !hasPhone;
    }

    set errors(value: string) {
        this.errorsElement.textContent = value;
    }

    set email(value: string) {
        this.emailInput.value = value;
        this.updateSubmitButton();
    }

    set phone(value: string) {
        this.phoneInput.value = value;
        this.updateSubmitButton();
    }

    clear(): void {
        this.emailInput.value = '';
        this.phoneInput.value = '';
        this.errorsElement.textContent = '';
        this.updateSubmitButton();
    }
}