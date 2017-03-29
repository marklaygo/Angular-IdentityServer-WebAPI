import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { Http, RequestOptions } from '@angular/http';
import { MaterialModule } from '@angular/material';

import { AccountRoutingModule } from './account-routing.module';
import { AccountService } from './shared/account.service';
    
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { AuthGuard } from './shared/auth-guard.service';
import { AuthService } from './shared/auth.service';
import { ProfileService } from './shared/profile.service';
import { TokenService } from './shared/token.service';

import { ChangePasswordComponent } from './changepassword/change-password.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SettingsComponent } from './settings/settings.component';

// https://github.com/auth0/angular2-jwt#advanced-configuration
function authHttpServiceFactory(http: Http, options: RequestOptions) {
    return new AuthHttp(new AuthConfig({
        tokenName: 'access_token',
        tokenGetter: (() => localStorage.getItem('access_token')),
        globalHeaders: [{ 'Content-Type': 'application/json' }],
        noJwtError: true,
    }), http, options);
}

@NgModule({
    imports: [
        AccountRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,        
        MaterialModule,
        ReactiveFormsModule
    ],
    declarations: [
        ChangePasswordComponent,
        LoginComponent,
        RegisterComponent,
        SettingsComponent
    ],
    providers: [
        AccountService,
        AuthGuard,
        AuthService,
        {
            provide: AuthHttp,
            useFactory: authHttpServiceFactory,
            deps: [Http, RequestOptions]
        },
        ProfileService,
        TokenService
    ]
})
export class AccountModule { }
