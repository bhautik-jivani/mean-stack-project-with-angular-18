import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { cannotContainSpace } from '../../shared/validators/cannot-contain-space.validators';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../auth.service';
import { AuthData } from '../auth-data.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, ReactiveFormsModule, MatCard,  MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService = inject(AuthService)
  private destroyRef = inject(DestroyRef)

  isButtonDisabled = signal(false)

  hide = signal(true);
  clickEvent() {
    this.hide.set(!this.hide());
    // event.stopPropagation();
  }

  loginForm = new FormGroup({
    email: new FormControl("", { nonNullable: true, validators: [Validators.required, Validators.email, cannotContainSpace] }),
    password: new FormControl("", { nonNullable: true, validators: [Validators.required, Validators.minLength(6), cannotContainSpace] }),
  })

  get emailIsRequired() {
    return this.loginForm.controls.email.invalid && this.loginForm.controls.email.hasError("required")
  }
  get emailIsValid() {
    return this.loginForm.controls.email.invalid && this.loginForm.controls.email.hasError("email")
  }
  get hasEmailContainSpace() {
    return this.loginForm.controls.email.invalid && this.loginForm.controls.email.hasError("cannotContainSpace")
  }
  
  get passwordIsRequired() {
    return this.loginForm.controls.password.invalid && this.loginForm.controls.password.hasError("required")
  }
  
  get hasPasswordValidMinLength() {
    return this.loginForm.controls.password.invalid && this.loginForm.controls.password.hasError("minlength")
  }
  
  get hasPasswordContainSpace() {
    return this.loginForm.controls.password.invalid && this.loginForm.controls.password.hasError("cannotContainSpace")
  }

  onLogin(formDirective: FormGroupDirective) {
    if (this.loginForm.invalid) {
      return
    }

    const loginData: AuthData = { email: this.loginForm.value.email ?? '', password: this.loginForm.value.password ?? '' }
    const subscription = this.authService.login(loginData).subscribe({
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
    this.hide.set(true)
    formDirective.resetForm()
    this.loginForm.reset()
  }
}
