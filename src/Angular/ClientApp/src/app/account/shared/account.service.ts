import { Injectable } from '@angular/core';
import { Observable, of, throwError, BehaviorSubject, interval } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { ProfileService } from './profile.service';
import { environment } from '../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

export interface ErrorAccountResponse {
  succeeded: boolean;
  errors: any[];
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient, private profileService: ProfileService) { }

  public register(username: string, password: string): Observable<any> {

    let requestBody = {
      Email: username,
      Password: password
    }

    return this.http.post<ErrorAccountResponse>(environment.Register_Endpoint, JSON.stringify(requestBody), httpOptions)
      .pipe(
        map((res: ErrorAccountResponse) => {
          let obj: Object;

          if (res.succeeded) {
            obj = {
              code: 'Succeeded',
              msg: 'Register complete'
            }
          } else {
            if (typeof res.errors[0].code !== 'undefined') {
              switch (res.errors[0].code) {
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
        }),
        catchError(error => this.handleErrorObservable(error))
      );
  }

  public changePassword(oldPassword: string, newPassword: string): Observable<any> {
    let requestBody = {
      Email: this.profileService.getUserEmail(),
      OldPassword: oldPassword,
      NewPassword: newPassword
    }

    return this.http.post<ErrorAccountResponse>(environment.ChangePassword_Endpoint, JSON.stringify(requestBody), httpOptions)
      .pipe(
        map((res: ErrorAccountResponse) => {
          let obj: Object;

          if (res.succeeded) {
            obj = {
              code: 'Succeeded',
              msg: 'Change password complete'
            }
          } else {
            if (typeof res.errors[0].code !== 'undefined') {
              switch (res.errors[0].code) {
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

        }),
        catchError(error => this.handleErrorObservable(error))
      );
  }

  //
  // Helpers
  //

  private handleErrorObservable(error: Response | any) {
    return throwError(error.error);
  }
}
