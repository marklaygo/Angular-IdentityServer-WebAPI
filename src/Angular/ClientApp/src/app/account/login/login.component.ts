import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../shared/auth.service';

export class LoginModel {
  constructor(
    public email: string,
    public password: string
  ) { }
}

export interface ErrorLoginResponse {
  error: string;
  error_description: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private toolbarTitle: string = 'Login Form';
  private loading: boolean;
  private returnUrl: string;
  private actionError: boolean;
  private actionErrorMsg: string;
  private loginModel: LoginModel;
  private loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private route: ActivatedRoute, private router: Router) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl']; // get returnUrl parameter
  }

  ngOnInit(): void {
    this.loginModel = new LoginModel('test@test.com', '11234');
    this.buildForm();
  }

  private onSubmit(): void {
    this.loading = true;
    this.authService.signIn(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe(
        () => {
          if (this.authService.isAuthenticated()) {
            // start schedule token refresh
            this.authService.scheduleRefresh();

            // check if there is a returnUrl, otherwise navigate to home
            let redirectUrl = this.returnUrl ? this.returnUrl : '/home';
            this.router.navigate([redirectUrl]);
          }
        },
        error => {
          if (error.error_description === 'invalid_username_or_password') {
            this.actionError = true;
            this.actionErrorMsg = 'Email or password is incorrect';
            this.loginForm.get('password').reset();
          }

          this.loading = false;
        }
      );
  }

  // https://angular.io/guide/form-validation#reactive-form-validation
  private buildForm(): void {
    this.loginForm = this.fb.group({
      email: [this.loginModel.email, [
        Validators.required,
        Validators.email]
      ],
      password: [this.loginModel.password, Validators.required]
    });

    this.loginForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // re(set) validation messages now
  }

  private onValueChanged(data?: any) {
    if (!this.loginForm) {
      return;
    }
    const form = this.loginForm;

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
  }

  private formErrors = {
    'email': '',
    'password': ''
  }

  private validationMessages = {
    'email': {
      'required': 'Email is required.',
      'email': 'Email is invalid.'
    },
    'password': {
      'required': 'Password is required.'
    }
  }
}
