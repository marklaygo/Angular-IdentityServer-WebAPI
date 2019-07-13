import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, RouterState } from '@angular/router';

import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  // https://angular.io/guide/router#milestone-5-route-guards
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
