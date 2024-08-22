import { Component } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [MatCard, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss'
})
export class ContactFormComponent {

  contactForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    message: new FormControl('', [Validators.required]),
  })

  get nameIsValid() {
    return  this.contactForm.controls.name.touched && this.contactForm.controls.name.dirty && this.contactForm.controls.name.invalid
  }
  
  get emailIsValid() {
    return  this.contactForm.controls.email.touched && this.contactForm.controls.email.dirty && this.contactForm.controls.email.invalid
  }
 
  get messageIsValid() {
    return  this.contactForm.controls.message.touched && this.contactForm.controls.message.dirty && this.contactForm.controls.message.invalid
  }

  onSubmit(formDirective: FormGroupDirective) {
    if (this.contactForm.invalid) {
      return
    }
    this.onReset(formDirective)
  }

  onReset(formDirective: FormGroupDirective) {
    formDirective.resetForm();
    // this.contactForm.reset({
    //   email: '',
    //   name: '',
    //   message: ''
    // })
  }
}
