import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    private authService = inject(AuthService)
    private router = inject(Router)

    isAuthenticated = this.authService.token()

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
        if(!this.isAuthenticated) {
            this.router.navigate(['/login'])
        }
        return true
    }
}