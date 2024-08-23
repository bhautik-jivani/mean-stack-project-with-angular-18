import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { AuthData } from "./auth-data.model";
import { catchError, tap, throwError } from "rxjs";
import { LoaderService } from "../shared/loader.service";
import { ModalService } from "../shared/modal.service";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient)
    private modalService = inject(ModalService)
    private loaderService = inject(LoaderService)
    private _token = signal<string>('')
    private router = inject(Router)
    private tokenTimer: any

    token = this._token.asReadonly()

    createUser(authData: AuthData) {
        this.loaderService.showLoader()
        return this.http.post<{ message: string, user: any }>("http://localhost:3000/api/user/signup", authData).pipe(
            catchError((error) => {
                const messages = {
                    title: "An error occured",
                    message: error.error.message,
                    mode: "ERROR"
                }
                this.loaderService.hideLoader()
                this.modalService.showMessage(messages)
                return throwError(() => new Error(messages.message))
            }),
            tap({
                next: (transformedUserData) => {
                    const messages = {
                        title: "Success",
                        message: "User registered successfully.",
                        mode: "SUCCESS"
                    }
                    this.loaderService.hideLoader()
                    this.modalService.showMessage(messages)
                }
            })
        )
    }

    login(authData: AuthData) {
        return this.http.post<{ token: string, expiresIn: number }>("http://localhost:3000/api/user/login", authData).pipe(
            catchError((error) => {
                const messages = {
                    title: 'An error occured',
                    message: error.error.message,
                    mode: "ERROR"
                }
                this.loaderService.hideLoader()
                this.modalService.showMessage(messages)
                return throwError(() => new Error(messages.message))
            }),
            tap({
                next: (resp) => {
                    this.loaderService.hideLoader()
                    if(resp.token) {
                        const token = resp.token
                        const expiresInDuration = resp.expiresIn
                        this.setAuthTimer(expiresInDuration)
                        const now = new Date()
                        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000)
                        this.saveAuthData(token, expirationDate)
                        this._token.set(token)
                        const messages = {
                            title: "Success",
                            message: "User loggedin successfully.",
                            mode: "SUCCESS"
                        }
                        this.modalService.showMessage(messages)
                        this.router.navigate(["/"])
                    } else {
                        const messages = {
                            title: "An error occured",
                            message: "Something went wrong, token not founded from server, please try again!",
                            mode: "ERROR"
                        }
                        this.modalService.showMessage(messages)
                    }
                }
            })
        )
    }

    logout() {
        this._token.set('')
        clearTimeout(this.tokenTimer)
        this.clearAuthData()
        this.router.navigate(["/"])
    }

    autoAuthUser() {
        const authInformation = this.getAuthData()
        if(!authInformation) {
            return
        }
        
        const now = new Date()
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime()
        if (expiresIn > 0) {
            this._token.set(authInformation.token)
            this.setAuthTimer(expiresIn / 1000)
        } 
    }

    private setAuthTimer(duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logout()
        }, duration * 1000)
    }

    private saveAuthData(token: string, expirationDate: Date) {
        localStorage.setItem("token", token)
        localStorage.setItem("expiration", expirationDate.toISOString())
    }

    private clearAuthData() {
        localStorage.removeItem("token")
        localStorage.removeItem("expiration")
    }

    private getAuthData() {
        const token = localStorage.getItem("token")
        const expirationDate = localStorage.getItem("expiration")

        if (!token || !expirationDate) {
            return
        }

        return {
            token: token,
            expirationDate: new Date(expirationDate)
        }
    }
}