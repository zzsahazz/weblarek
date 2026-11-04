
import type { ApiPostMethods } from '../../types';

export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;

        this.options = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as Record<string, string> ?? {}),
            },
        };
    }

    // Обработка ответа сервера
    protected handleResponse<T>(response: Response): Promise<T> {
        if (response.ok) {
            return response.json();
        }

        return response.json().then((data) => {
            return Promise.reject(data.error ?? response.statusText);
        });
    }

    // GET-запрос
    get<T extends object>(uri: string): Promise<T> {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET',
        }).then((response) => this.handleResponse<T>(response));
    }

    // POST-запрос
    post<T extends object>(
        uri: string,
        data: object,
        method: ApiPostMethods = 'POST'
    ): Promise<T> {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data),
        }).then((response) => this.handleResponse<T>(response));
    }
}
