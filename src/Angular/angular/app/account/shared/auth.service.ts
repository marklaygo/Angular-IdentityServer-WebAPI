import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { AuthHttp } from 'angular2-jwt';
import { ProfileService } from './profile.service';
import { TokenService } from './token.service';

import { environment } from 'environment';

@Injectable()
export class AuthService {
    public isAuthenticatedBehaviorSubject = new BehaviorSubject<boolean>(this.tokenService.isTokenNotExpired());

    private header: Headers;
    private options: RequestOptions;
    private refreshSubscription: any;

    constructor(private authHttp: AuthHttp, private http: Http, private profileService: ProfileService, private tokenService: TokenService) {
        this.header = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        this.options = new RequestOptions({ headers: this.header });
    }

    public isAuthenticated(): Observable<boolean> {
        return this.isAuthenticatedBehaviorSubject.asObservable();
    }

    public singIn(username: string, password: string): Observable<any> {

        // identityserver4 openid spec
        let requestBody = new URLSearchParams();
        requestBody.append('client_id', environment.Client_Id);
        requestBody.append('grant_type', environment.Grant_Type_Password);
        requestBody.append('username', username);
        requestBody.append('password', password);
        requestBody.append('scope', environment.Scope);

        // auth
        return this.http.post(environment.Token_Endpoint, requestBody, this.options)
            .map((res: Response) => {
                let responseBody: any = res.json();
                if (typeof responseBody.access_token !== 'undefined') {
                    this.saveToken(responseBody); // save token to localStorage
                    this.isAuthenticatedBehaviorSubject.next(true);

                    this.getUserProfile();
                }
            })
            .catch((error: any) => {
                let errorBody = error.json();
                return Observable.throw(errorBody.error_description);
            });
    }

    public signOut(): void {
        this.tokenService.removeToken();
        this.isAuthenticatedBehaviorSubject.next(false);
        this.unscheduleRefresh();
    }

    //
    // http://blog.ionic.io/ionic-2-and-auth0/
    //

    public scheduleRefresh(): void {
        console.log('refresh token schedule start');
        let source = this.authHttp.tokenStream.flatMap(
            (token: string) => {
                let delay = this.tokenService.getExpiresIn() * 1000;
                delay -= delay * 0.10; // decrease the delay to avoid unexpected 401

                return Observable.interval(delay);
            }
        );

        this.refreshSubscription = source.subscribe(() => {
            this.getNewJwt().subscribe();
        });
    }

    public startupTokenRefresh(): void {
        if (this.isAuthenticatedBehaviorSubject.getValue()) {
            let source = this.authHttp.tokenStream.flatMap(
                (token: string) => {
                    let now: number = new Date().valueOf();
                    let delay = (this.tokenService.getExpiresIn() - now) * 1000;

                    return Observable.timer(delay);
                }
            );

            source.subscribe(() => {
                this.getNewJwt().subscribe(() => { this.scheduleRefresh() });
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
        let requestBody = new URLSearchParams();
        requestBody.append('client_id', environment.Client_Id);
        requestBody.append('grant_type', environment.Grant_Type_RefreshToken);
        requestBody.append('refresh_token', this.tokenService.getRefreshToken());

        return this.http.post(environment.Token_Endpoint, requestBody, this.options)
            .map((res: Response) => {
                let responseBody: any = res.json();
                if (typeof responseBody.access_token !== 'undefined') {
                    this.saveToken(responseBody);

                    console.log('token refreshed');
                }
            })
            .catch((error: any) => {
                let errorBody = error.json();
                return Observable.throw(errorBody.error);
            });
    }

    private getUserProfile(): void {
        if (this.isAuthenticatedBehaviorSubject.getValue()) {
            this.authHttp.get(environment.UserInfo_Endpoint)
                .subscribe((res: Response) => {
                    this.profileService.saveUserProfile(JSON.stringify(res.json()));
                });
        }
    }

    //
    // helpers
    //

    private saveToken(response: any): void {
        this.tokenService.saveAcessToken(response.access_token);
        this.tokenService.saveExpiresIn(response.expires_in);
        this.tokenService.saveRefreshToken(response.refresh_token);
    }
}
