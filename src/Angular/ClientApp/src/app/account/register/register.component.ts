import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AccountService } from '../shared/account.service';
import { PasswordMatchValidator } from '../shared/password-match-validator';

export class RegisterModel {
  constructor(
    public email: string,
    public password: string,
    public confirmPassword: string,
  ) { }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  private toolbarTitle: string = 'Registration Form';
  private loading: boolean;
  private actionError: boolean;
  private actionErrorMsg: string;
  private alertStatus: boolean;
  private registerModel: RegisterModel;
  private registerForm: FormGroup;

  constructor(private accountService: AccountService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.registerModel = new RegisterModel("test@test.com", "11234", "11234");
    this.buildForm();
  }

  private onSubmit(): void {
    this.loading = true;
    this.accountService.register(this.registerForm.value.email, this.registerForm.value.password)
      .subscribe(
        data => {
          this.actionError = true; // show the error

          if (data.code == 'Succeeded') {
            this.alertStatus = false;
            this.actionErrorMsg = data.msg;
            this.registerForm.reset();
          } else if (data.code === 'DuplicateUserName') {
            this.alertStatus = true; // show alert error
            this.actionErrorMsg = data.msg;
            this.registerForm.get('password').reset();
            this.registerForm.get('confirmPassword').reset();
          }

          this.loading = false;
        },
        error => {
          this.loading = false;
        }
      );
  }

  // https://angular.io/guide/form-validation#reactive-form-validation
  private buildForm() {
    this.registerForm = this.fb.group({
      email: [this.registerModel.email, [
        Validators.required,
        Validators.email
      ]
      ],
      password: [this.registerModel.password, [
        Validators.required,
        Validators.minLength(4)
      ]
      ],
      confirmPassword: [this.registerModel.confirmPassword, Validators.required]
    }, { validator: PasswordMatchValidator('password', 'confirmPassword') });

    this.registerForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // re(set) validation messages now
  }

  private onValueChanged(data?: any) {
    if (!this.registerForm) {
      return;
    }
    const form = this.registerForm;

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
    'email': '',
    'password': '',
    'confirmPassword': ''
  }

  private validationMessages = {
    'email': {
      'required': 'Email is required.',
      'email': 'Email is invalid.'
    },
    'password': {
      'required': 'Password is required.',
      'minlength': 'Password must be at least 4 characters long.'
    },
    'confirmPassword': {
      'required': 'Confirm password is required.',
      'doesNotMatch': 'Password does not match.'
    }
  }
}
