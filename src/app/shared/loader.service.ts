import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class LoaderService {
    private _loader = signal<boolean>(false)

    loader = this._loader.asReadonly()
    showLoader() {
        this._loader.set(true)
    }

    hideLoader() {
        this._loader.set(false)
    }
}