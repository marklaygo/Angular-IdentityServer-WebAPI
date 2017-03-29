import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    // https://angular.io/docs/ts/latest/guide/router.html#!#teach-authguard-to-authenticate
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;

        return this.checkLogin(url);
    }

    private checkLogin(url: string): boolean {
        if (this.authService.isAuthenticatedBehaviorSubject.getValue()) {
            return true;
        }

        this.router.navigate(['/login'], { queryParams: { returnUrl: url } });
        return false;
    }
}
