
import { BuyerErrors, TPayment, TBuyerData } from '../../types';
import { IEvents } from '../base/Events';

export class BuyerModel {
    protected paymentMethod: TPayment | '' = '';
    protected deliveryAddress = '';
    protected emailAddress = '';
    protected phoneNumber = '';

    constructor(protected events: IEvents) {}

    updateBuyerData(data: Partial<TBuyerData>): void {
        if (data.payment !== undefined) {
            this.paymentMethod = data.payment;
        }

        if (data.address !== undefined) {
            this.deliveryAddress = data.address;
        }

        if (data.email !== undefined) {
            this.emailAddress = data.email;
        }

        if (data.phone !== undefined) {
            this.phoneNumber = data.phone;
        }

        this.events.emit('buyer:changed');
    }

    getBuyerData(): TBuyerData {
        return {
            payment: this.paymentMethod,
            address: this.deliveryAddress,
            email: this.emailAddress,
            phone: this.phoneNumber,
        };
    }

    clearBuyerData(): void {
        this.paymentMethod = '';
        this.deliveryAddress = '';
        this.emailAddress = '';
        this.phoneNumber = '';

        this.events.emit('buyer:changed');
    }

    validateBuyerData(): BuyerErrors {
        const errors: BuyerErrors = {};

        if (!this.paymentMethod) {
            errors.payment = 'Не выбран вид оплаты';
        }

        if (!this.deliveryAddress.trim()) {
            errors.address = 'Необходимо указать адрес';
        }

        if (!this.emailAddress.trim()) {
            errors.email = 'Укажите email';
        }

        if (!this.phoneNumber.trim()) {
            errors.phone = 'Укажите телефон';
        }

        return errors;
    }
}
