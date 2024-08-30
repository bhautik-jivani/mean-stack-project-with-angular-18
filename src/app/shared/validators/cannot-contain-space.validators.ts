import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms"

export const cannotContainSpace: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    // if((control.value as string).indexOf(' ') >= 0) {
    //     return { cannotContainSpace: true }  
    // }
    // return null

    if((control.value || '').trim().length) {
        return null
    }
    return { cannotContainSpace: true }  
  }