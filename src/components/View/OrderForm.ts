import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { TPayment } from '../../types';
import { ensureElement } from '../../utils/utils';

export class OrderForm extends Component<{}> {
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;
    protected addressInput: HTMLInputElement;
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    protected paymentMethod: TPayment | '' = '';

    constructor(
        protected events: IEvents,
        container: HTMLFormElement
    ) {
        super(container);

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

        this.submitButton = ensureElement<HTMLButtonElement>(
            '.order__button',
            this.container
        );

        this.errorsElement = ensureElement<HTMLElement>(
            '.form__errors',
            this.container
        );

        // Выбор оплаты картой
        this.cardButton.addEventListener('click', () => {
            this.setPayment(TPayment.CARD);
        });

        // Выбор оплаты при получении
        this.cashButton.addEventListener('click', () => {
            this.setPayment(TPayment.CASH);
        });

        // Изменение адреса
        this.addressInput.addEventListener('input', () => {
            this.events.emit('order:address-change', {
                address: this.addressInput.value
            });

            this.updateSubmitButton();
        });

        // Отправка формы
        this.container.addEventListener('submit', (event) => {
            event.preventDefault();

            if (this.submitButton.disabled) {
                return;
            }

            this.events.emit('order:submit');
        });

        // Начальная проверка формы
        this.updateSubmitButton();
    }

    // Выбор способа оплаты
    setPayment(payment: TPayment): void {
        this.paymentMethod = payment;

        this.cardButton.classList.toggle(
            'button_alt-active',
            payment === TPayment.CARD
        );

        this.cashButton.classList.toggle(
            'button_alt-active',
            payment === TPayment.CASH
        );

        this.events.emit('order:payment-change', {
            payment
        });

        this.updateSubmitButton();
    }

    // Проверка заполнения формы
    protected updateSubmitButton(): void {
        const hasPayment = this.paymentMethod !== '';
        const hasAddress = this.addressInput.value.trim() !== '';

        this.submitButton.disabled = !hasPayment || !hasAddress;
    }

    // Отображение ошибок
    set errors(value: string) {
        this.errorsElement.textContent = value;
    }

    // Установка адреса
    set address(value: string) {
        this.addressInput.value = value;
        this.updateSubmitButton();
    }

    // Установка способа оплаты
    set payment(value: TPayment) {
        this.setPayment(value);
    }

    // Очистка формы
    clear(): void {
        this.paymentMethod = '';
        this.addressInput.value = '';
        this.errorsElement.textContent = '';

        this.cardButton.classList.remove('button_alt-active');
        this.cashButton.classList.remove('button_alt-active');

        this.updateSubmitButton();
    }
}