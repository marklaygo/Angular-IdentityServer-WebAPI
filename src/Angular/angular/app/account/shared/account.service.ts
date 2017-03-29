import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { AuthHttp } from 'angular2-jwt';
import { AuthService } from './auth.service';
import { ProfileService } from './profile.service';

import { environment } from 'environment';

@Injectable()
export class AccountService {
    private headers: Headers;
    private options: RequestOptions;

    constructor(private http: Http, private authService: AuthService, private authHttp: AuthHttp, private profileService: ProfileService) {
        this.headers = new Headers({ 'Content-Type': 'application/json' });
        this.options = new RequestOptions({ headers: this.headers });
    }

    public register(username: string, password: string): Observable<any> {
        let requestBody = {
            Email: username,
            Password: password
        }

        return this.http.post(environment.Register_Endpoint, JSON.stringify(requestBody), this.options)
            .map((res: Response) => {
                let responeBody = res.json();
                let obj: Object;

                if (responeBody.succeeded) {
                    obj = {
                        code: 'Succeeded',
                        msg: 'Register complete'
                    }
                } else {
                    if (typeof responeBody.errors[0].code !== 'undefined') {
                        switch (responeBody.errors[0].code) {
                            case 'DuplicateUserName': {
                                obj = {
                                    code: 'DuplicateUserName',
                                    msg: 'Email already exist'
                                }
                                break;
                            }
                        }
                    }
                }

                return obj;
            })
            .catch(this.handleError);
    }

    public changePassword(oldPassword: string, newPassword: string): Observable<any> {
        let requestBody = {
            Email: this.profileService.getUserEmail(),
            OldPassword: oldPassword,
            NewPassword: newPassword
        }

        return this.authHttp.post(environment.ChangePassword_Endpoint, JSON.stringify(requestBody), this.options)
            .map((res: Response) => {
                let responeBody = res.json();
                let obj: Object;

                if (responeBody.succeeded) {
                    obj = {
                        code: 'Succeeded',
                        msg: 'Change password complete'
                    }
                } else {
                    if (typeof responeBody.errors[0].code !== 'undefined') {
                        switch (responeBody.errors[0].code) {
                            case 'PasswordMismatch': {
                                obj = {
                                    code: 'PasswordMismatch',
                                    msg: 'Incorrect password'
                                }
                                break;
                            }
                        }
                    }
                }

                return obj;

            })
            .catch(this.handleError);
    }

    //
    // Helpers
    //

    private handleError(error: Response | any) {
        let errMsg: string;

        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }

        return Observable.throw(errMsg);
    }
}
