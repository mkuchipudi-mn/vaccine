import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  Roles: any = ['Admin', 'Author', 'Reader'];
  User: any = ['Super Admin', 'Author', 'Reader'];
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  UsernameFormControl = new FormControl('', [Validators.required, Validators.maxLength(60)]);
  PasswordFormControl = new FormControl('', [Validators.required, Validators.maxLength(60)]);
  matcher = new MyErrorStateMatcher();
}
