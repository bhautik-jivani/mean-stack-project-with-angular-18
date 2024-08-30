import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";

import { AuthService } from "./auth.service";

export function authInterceptors(req: HttpRequest<unknown>, next: HttpHandlerFn) {
    const authToken = inject(AuthService).token()

    const newReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`),
    })

    return next(newReq)
  }