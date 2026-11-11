import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { Form } from './Form';

export interface IContactsForm {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsForm> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(
        protected events: IEvents,
        container: HTMLFormElement
    ) {
        super(container, () => {
            this.events.emit('contacts:submit');
        });

        this.emailInput = ensureElement<HTMLInputElement>(
            'input[name="email"]',
            this.container
        );

        this.phoneInput = ensureElement<HTMLInputElement>(
            'input[name="phone"]',
            this.container
        );

        this.emailInput.addEventListener('input', () => {
            this.events.emit('contacts:email-change', {
                email: this.emailInput.value
            });
        });

        this.phoneInput.addEventListener('input', () => {
            this.events.emit('contacts:phone-change', {
                phone: this.phoneInput.value
            });
        });
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }
}