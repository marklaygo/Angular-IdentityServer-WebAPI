import { Injectable } from '@angular/core';
import { Observable, of, throwError, BehaviorSubject, interval } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { TokenService } from './token.service';
import { ProfileService } from './profile.service';
import { JwtResponse } from './jwt-response';

import { environment } from '../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAuthenticatedBehaviorSubject = new BehaviorSubject<boolean>(this.tokenService.isTokenExpired());

  private refreshSubscription: any;

  constructor(
    private http: HttpClient,
    private profileService: ProfileService,
    private tokenService: TokenService) { }

  public isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedBehaviorSubject.asObservable();
  }

  // sign in
  public signIn(username: string, password: string): Observable<any> {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('client_id', environment.Client_Id);
    httpParams = httpParams.append('grant_type', environment.Grant_Type_Password);
    httpParams = httpParams.append('username', username);
    httpParams = httpParams.append('password', password);
    httpParams = httpParams.append('scope', environment.Scope);

    return this.http.post<JwtResponse>(environment.Token_Endpoint, httpParams, httpOptions)
      .pipe(
        map((res: JwtResponse) => {
          if (typeof res.access_token !== 'undefined') {
            this.saveToken(res);
            this.isAuthenticatedBehaviorSubject.next(true);

            this.getUserProfile();
          }
        }),
        catchError(error => this.handleErrorObservable(error))
      );
  }

  // sign out
  public signOut(): void {
    this.tokenService.removeToken();
    this.isAuthenticatedBehaviorSubject.next(false);
    this.unscheduleRefresh();
  }

  //
  // token refresh
  //

  public scheduleRefresh(): void {
    console.log('refresh token schedule start');
    let delay = this.tokenService.getExpiresIn() * 1000; // seconds to ms
    delay -= delay * 0.10; // decrease delay by 10% to avoid unexpected 401

    this.refreshSubscription = interval(delay).subscribe(() => {
      this.getNewJwt().subscribe();
    });
  }

  public startupTokenRefresh(): void {
    if (this.isAuthenticatedBehaviorSubject.getValue()) {
      let now: number = new Date().valueOf();
      let delay = (this.tokenService.getExpiresIn() - now) * 1000;

      this.refreshSubscription = interval(delay).subscribe(() => {
        this.getNewJwt().subscribe();
      });
    }
  }

  public unscheduleRefresh(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  private getNewJwt(): Observable<any> {
    // identityserver4 openid spec
    let httpParams = new HttpParams();
    httpParams = httpParams.append('client_id', environment.Client_Id);
    httpParams = httpParams.append('grant_type', environment.Grant_Type_RefreshToken);
    httpParams = httpParams.append('refresh_token', this.tokenService.getRefreshToken());

    return this.http.post(environment.Token_Endpoint, httpParams, httpOptions)
      .pipe(
        map((res: JwtResponse) => {
          if (typeof res.access_token !== 'undefined') {
            this.saveToken(res);
            this.isAuthenticatedBehaviorSubject.next(true);
          }
        }),
        catchError(error => this.handleErrorObservable(error))
      );
  }

  private getUserProfile(): void {
    if (this.isAuthenticatedBehaviorSubject.getValue()) {
      this.http.get(environment.UserInfo_Endpoint)
        .subscribe(res => {
          this.profileService.saveUserProfile(JSON.stringify(res));
        });
    }
  }

  //
  // helpers
  //

  private saveToken(res: JwtResponse): void {
    this.tokenService.saveAcessToken(res.access_token);
    this.tokenService.saveExpiresIn(res.expires_in);
    this.tokenService.saveRefreshToken(res.refresh_token);
  }

  private handleErrorObservable(error: Response | any) {
    return throwError(error.error);
  }
}
