import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { LoaderService } from "./shared/loader.service";
import { ModalService } from "./shared/modal.service";


export function errorInterceptors(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const loaderService = inject(LoaderService)
  const modalService = inject(ModalService)
  let errorMessage = "Something went wrong! Please try again later."

  return next(req).pipe(
    catchError((error) => {
      console.log(error);
      
      if (error.error.message) {
        errorMessage = error.error.message
      }
      const messages = {
          title: "An error occured",
          message: errorMessage,
          mode: "ERROR"
      }
      loaderService.hideLoader()
      modalService.showMessage(messages)
      return throwError(() => new Error(errorMessage))
  })
  )
}