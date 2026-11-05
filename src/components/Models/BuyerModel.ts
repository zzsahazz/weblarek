
import { IBuyer, BuyerErrors, TPayment } from '../../types';

export class BuyerModel {
    protected paymentMethod: TPayment | '' = '';
    protected deliveryAddress = '';
    protected emailAddress = '';
    protected phoneNumber = '';

    // Частичное обновление данных покупателя
    updateBuyerData(data: Partial<IBuyer>): void {
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
    }

    // Получение данных покупателя
    getBuyerData(): Partial<IBuyer> {
        return {
            payment: this.paymentMethod,
            address: this.deliveryAddress,
            email: this.emailAddress,
            phone: this.phoneNumber,
        };
    }

    // Очистка данных покупателя
    clearBuyerData(): void {
        this.paymentMethod = '';
        this.deliveryAddress = '';
        this.emailAddress = '';
        this.phoneNumber = '';
    }

    // Проверка заполненности данных покупателя
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
