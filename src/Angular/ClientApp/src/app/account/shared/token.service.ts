import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private jwtHelper = new JwtHelperService();

  public removeToken(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('expires_in');
    localStorage.removeItem('refresh_token');
  }

  public getAccessToken(): string {
    return localStorage.getItem('access_token');
  }

  public getRefreshToken(): string {
    return localStorage.getItem('refresh_token');
  }

  public getExpiresIn(): number {
    return parseInt(localStorage.getItem('expires_in'));
  }

  public saveAcessToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  public saveExpiresIn(expiresIn: number): void {
    localStorage.setItem('expires_in', expiresIn.toString());
  }

  public saveRefreshToken(token: string): void {
    localStorage.setItem('refresh_token', token);
  }

  public isTokenExpired(): boolean {
    let token: string = this.getAccessToken();
    let tokenExpired: boolean = token != null && this.jwtHelper.isTokenExpired(token);

    return tokenExpired;
  }
}
