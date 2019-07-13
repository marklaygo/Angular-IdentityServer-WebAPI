import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AccountService } from '../shared/account.service';
import { PasswordMatchValidator } from './../shared/password-match-validator';

export class ChangePasswordModel {
  public oldPassword: string;
  public newPassword: string;
  public confirmPassword: string;
}

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {
  private loading: boolean;
  private actionError: boolean;
  private actionErrorMsg: string;
  private alertStatus: boolean;
  private changePasswordModel: ChangePasswordModel;
  private changePasswordForm: FormGroup;

  constructor(private accountService: AccountService, private fb: FormBuilder, private location: Location) { }

  ngOnInit(): void {
    this.changePasswordModel = new ChangePasswordModel();
    this.buildForm();
  }

  private onSubmit(): void {
    this.loading = true;
    this.accountService.changePassword(this.changePasswordForm.value.oldPassword, this.changePasswordForm.value.newPassword)
      .subscribe(
        data => {
          this.actionError = true; // show the error

          if (data.code == 'Succeeded') {
            this.alertStatus = false;
            this.actionErrorMsg = data.msg;
          } else if (data.code === 'PasswordMismatch') {
            this.alertStatus = true; // show alert error
            this.actionErrorMsg = data.msg;
          }

          this.changePasswordForm.reset();
          this.loading = false;
        },
        error => {
          this.loading = false;
          this.actionError = true;
        }
      );
  }

  private goBack() {
    this.location.back();
  }

  // https://angular.io/guide/form-validation#reactive-form-validation
  private buildForm() {
    this.changePasswordForm = this.fb.group({
      oldPassword: [this.changePasswordModel.oldPassword, Validators.required],
      newPassword: [this.changePasswordModel.oldPassword, [
        Validators.required,
        Validators.minLength(4)
      ]
      ],
      confirmPassword: [this.changePasswordModel.oldPassword, Validators.required],
    }, { validator: PasswordMatchValidator('newPassword', 'confirmPassword') });

    this.changePasswordForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // re(set) validation messages now
  }

  private onValueChanged(data?: any) {
    if (!this.changePasswordForm) {
      return;
    }
    const form = this.changePasswordForm;

    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + '<br />';
        }
      }
    }

    // validation for confirm password
    const confirmPasswordError = 'doesNotMatch';
    const confirmPasswordKey = 'confirmPassword';
    if (form.hasError(confirmPasswordError)) {
      const messages = this.validationMessages[confirmPasswordKey];
      this.formErrors[confirmPasswordKey] += messages[confirmPasswordError] + '<br />';
    }
  }

  private formErrors = {
    'oldPassword': '',
    'newPassword': '',
    'confirmPassword': ''
  }

  private validationMessages = {
    'oldPassword': {
      'required': 'Password is required.',
    },
    'newPassword': {
      'required': 'Password is required.',
      'minlength': 'Password must be at least 4 characters long.'
    },
    'confirmPassword': {
      'required': 'Confirm password is required.',
      'doesNotMatch': 'Password does not match.'
    }
  }
}
