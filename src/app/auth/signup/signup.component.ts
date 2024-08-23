import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { cannotContainSpace } from '../../shared/validators/cannot-contain-space.validators';
import { AuthService } from '../auth.service';
import { AuthData } from '../auth-data.model';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [MatFormFieldModule, ReactiveFormsModule, MatCard,  MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  private authService = inject(AuthService)
  private destroyRef = inject(DestroyRef)

  isButtonDisabled = signal(false)

  hide = signal(true);
  clickEvent() {
    this.hide.set(!this.hide());
    // event.stopPropagation();
  }

  signupForm = new FormGroup({
    email: new FormControl("", { nonNullable: true, validators: [Validators.required, Validators.email, cannotContainSpace] }),
    password: new FormControl("", { nonNullable: true, validators: [Validators.required, Validators.minLength(6), cannotContainSpace] }),
  })

  get emailIsRequired() {
    return this.signupForm.controls.email.invalid && this.signupForm.controls.email.hasError("required")
  }
  get emailIsValid() {
    return this.signupForm.controls.email.invalid && this.signupForm.controls.email.hasError("email")
  }
  get hasEmailContainSpace() {
    return this.signupForm.controls.email.invalid && this.signupForm.controls.email.hasError("cannotContainSpace")
  }
  
  get passwordIsRequired() {
    return this.signupForm.controls.password.invalid && this.signupForm.controls.password.hasError("required")
  }
  
  get hasPasswordValidMinLength() {
    return this.signupForm.controls.password.invalid && this.signupForm.controls.password.hasError("minlength")
  }
  
  get hasPasswordContainSpace() {
    return this.signupForm.controls.password.invalid && this.signupForm.controls.password.hasError("cannotContainSpace")
  }

  onSignup(formDirective: FormGroupDirective) {
    if (this.signupForm.invalid) {
      return
    }

    const signupData: AuthData = {
      email: this.signupForm.value.email ?? '',
      password: this.signupForm.value.password ?? ''
    }

    const subscription = this.authService.createUser(signupData).subscribe({
      error: (error) => {
        this.isButtonDisabled.set(false)
      },
      complete: () => {
        this.isButtonDisabled.set(false)
        this.onReset(formDirective)
      }
    })
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe()
    })
  }

  onReset(formDirective: FormGroupDirective) {
    formDirective.resetForm()
    this.signupForm.reset()
  }
}
