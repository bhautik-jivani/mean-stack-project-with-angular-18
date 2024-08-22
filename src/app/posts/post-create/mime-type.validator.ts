import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { map, Observable, of } from "rxjs";

export const mimeType: AsyncValidatorFn = (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
  if (typeof control.value === 'string') {
    return of(null); // If the value is a string, skip validation
  }
  
  const file = control.value as File;
  const fileReader = new FileReader();
  
  // Convert FileReader to an Observable
  const frObs = new Observable<{ [key: string]: any } | null>((observer) => {
    fileReader.onloadend = () => {
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
      let header = '';
      let isValid = false;
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16);
      }
      switch (header) {
        case '89504e47':
          isValid = true; // PNG
          break;
        case 'ffd8ffe0':
        case 'ffd8ffe1':
        case 'ffd8ffe2':
        case 'ffd8ffe3':
        case 'ffd8ffe8':
          isValid = true; // JPEG
          break;
        default:
          isValid = false; // Invalid mime type
          break;
      }
      if (isValid) {
        observer.next(null);
      } else {
        observer.next({ invalidMimeType: true });
      }
      observer.complete();
    };
    fileReader.readAsArrayBuffer(file);
  });

  return frObs.pipe(
    // Ensure that the emitted value conforms to the expected type
    map(value => value as { [key: string]: any } | null)
  );
};