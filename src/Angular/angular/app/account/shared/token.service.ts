import { Injectable } from '@angular/core';

import { tokenNotExpired, JwtHelper } from 'angular2-jwt';

@Injectable()
export class TokenService {
    private jwtHelper: JwtHelper = new JwtHelper();

    public removeToken(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('expires_in');
        localStorage.removeItem('refresh_token');
    }

    public getAccessToken(): string {
        return localStorage.getItem('access_token');
    }

    public saveAcessToken(token: string): void {
        localStorage.setItem('access_token', token);
    }

    public getExpiresIn(): number {
        return parseInt(localStorage.getItem('expires_in'));
    }

    public saveExpiresIn(expiresIn: string): void {
        localStorage.setItem('expires_in', expiresIn);
    }

    public getRefreshToken(): string {
        return localStorage.getItem('refresh_token');
    }

    public saveRefreshToken(token: string): void {
        localStorage.setItem('refresh_token', token);
    }

    public isTokenNotExpired(): boolean {
        let token: string = this.getAccessToken();
        let tokenExpired: boolean = token != null && !this.jwtHelper.isTokenExpired(token);
        return tokenExpired;
    }
}
