import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, tap, throwError } from "rxjs";

import { LoaderService } from "../shared/loader.service";
import { ModalService } from "../shared/modal.service";
import { AuthData } from "./auth-data.model";
import { environment } from "../../environments/environment";

const BASE_URL = environment.apiUrl
@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient)
    private modalService = inject(ModalService)
    private loaderService = inject(LoaderService)
    private _token = signal<string>('')
    private _userId = signal<string>('')
    private _email = signal<string>('')
    private router = inject(Router)
    private tokenTimer: any

    email = this._email.asReadonly()
    token = this._token.asReadonly()
    userId = this._userId.asReadonly()

    createUser(authData: AuthData) {
        this.loaderService.showLoader()
        return this.http.post<{ message: string, user: any }>(`${BASE_URL}/user/signup`, authData).pipe(
            // catchError((error) => {
            //     const messages = {
            //         title: "An error occured",
            //         message: error.error.message,
            //         mode: "ERROR"
            //     }
            //     this.loaderService.hideLoader()
            //     this.modalService.showMessage(messages)
            //     return throwError(() => new Error(messages.message))
            // }),
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
        return this.http.post<{userId: string, email: string, token: string, expiresIn: number }>(`${BASE_URL}/user/login`, authData).pipe(
            tap({
                next: (resp) => {
                    this.loaderService.hideLoader()
                    if(resp.token) {
                        const email = resp.email
                        const userId = resp.userId
                        const token = resp.token
                        const expiresInDuration = resp.expiresIn

                        this.setAuthTimer(expiresInDuration)
                        const now = new Date()
                        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000)
                        this.saveAuthData(userId, email, token, expirationDate)

                        this._userId.set(userId)
                        this._email.set(email)
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
        this._userId.set('')
        this._email.set('')
        clearTimeout(this.tokenTimer)
        this.clearAuthData()
        this.router.navigate(["/"])
    }

    autoAuthUser() {
        const authInformation = this.getAuthData()
        
        if(!authInformation) {
            this.clearAuthData()
            return
        }
        
        const now = new Date()
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime()
        if (expiresIn > 0) {
            this._userId.set(authInformation.userId)
            this._email.set(authInformation.email)
            this._token.set(authInformation.token)
            this.setAuthTimer(expiresIn / 1000)
        } 
    }

    private setAuthTimer(duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logout()
        }, duration * 1000)
    }

    private saveAuthData(userId: string, email: string, token: string, expirationDate: Date) {
        localStorage.setItem("userId", userId)
        localStorage.setItem("email", email)
        localStorage.setItem("token", token)
        localStorage.setItem("expiration", expirationDate.toISOString())
    }

    private clearAuthData() {
        localStorage.removeItem("userId")
        localStorage.removeItem("email")
        localStorage.removeItem("token")
        localStorage.removeItem("expiration")
    }

    private getAuthData() {
        const userId = localStorage.getItem("userId")
        const email = localStorage.getItem("email")
        const token = localStorage.getItem("token")
        const expirationDate = localStorage.getItem("expiration")

        if (!userId || !email || !token || !expirationDate) {
            return
        }

        return {
            userId: userId,
            email: email,
            token: token,
            expirationDate: new Date(expirationDate)
        }
    }
}