import { Injectable, signal } from "@angular/core";

export interface Modal {
    title: string,
    message: string
    mode: string
}

@Injectable({ providedIn: 'root' })
export class ModalService {
    private _message = signal<Modal | undefined>(undefined)

    message = this._message.asReadonly()

    showMessage(message: Modal) {
        this._message.set(message)
    }

    clearMessage() {
        this._message.set(undefined)
    }
}