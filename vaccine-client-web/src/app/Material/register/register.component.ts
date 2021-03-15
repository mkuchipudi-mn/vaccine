import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogComponent } from '../mat-dialog/mat-dialog.component';

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
  public selected = '';

  numTemplateOpens = 0;

  constructor(public dialog: MatDialog) {}
  openDialog() {
    this.dialog.open(MatDialogComponent);
  }
  ngOnInit(): void {}
  Roles: any = ['Admin', 'Author', 'Reader'];
  User: any = ['Super Admin', 'Author', 'Reader'];
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  UsernameFormControl = new FormControl('', [Validators.required, Validators.maxLength(60)]);
  PasswordFormControl = new FormControl('', [Validators.required, Validators.maxLength(60)]);
  ChooseDesignation = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();
}
