import { IEvents } from '../base/Events';
import { TPayment } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Form } from './Form';

export interface IOrderForm {
    address: string;
    payment: TPayment | '';
}

export class OrderForm extends Form<IOrderForm> {
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;
    protected addressInput: HTMLInputElement;

    constructor(
        protected events: IEvents,
        container: HTMLFormElement
    ) {
        super(container, () => {
            this.events.emit('order:submit');
        });

        this.cardButton = ensureElement<HTMLButtonElement>(
            'button[name="card"]',
            this.container
        );

        this.cashButton = ensureElement<HTMLButtonElement>(
            'button[name="cash"]',
            this.container
        );

        this.addressInput = ensureElement<HTMLInputElement>(
            'input[name="address"]',
            this.container
        );

        this.cardButton.addEventListener('click', () => {
            this.events.emit('order:payment-change', {
                payment: TPayment.CARD
            });
        });

        this.cashButton.addEventListener('click', () => {
            this.events.emit('order:payment-change', {
                payment: TPayment.CASH
            });
        });

        this.addressInput.addEventListener('input', () => {
            this.events.emit('order:address-change', {
                address: this.addressInput.value
            });
        });
    }

    set address(value: string) {
        this.addressInput.value = value;
    }

    set payment(value: TPayment | '') {
        this.cardButton.classList.toggle(
            'button_alt-active',
            value === TPayment.CARD
        );

        this.cashButton.classList.toggle(
            'button_alt-active',
            value === TPayment.CASH
        );
    }
}