import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent implements OnInit {
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {}
  submitForm() {
    console.log(this.registerForm.value);
  }

  registerForm: FormGroup = this.formBuilder.group({
    Username: [, { validators: [Validators.required], updateOn: 'change' }],
    password: [, { validators: [Validators.required], updateOn: 'change' }],
  });
}
