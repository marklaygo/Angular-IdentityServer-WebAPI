import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './account/shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private title: string = 'Angular';
  private isAuthenticated: Observable<boolean>;

  constructor(private authService: AuthService, private router: Router) {
    // schedule startup token refresh
    this.authService.startupTokenRefresh();

    this.isAuthenticated = this.authService.isAuthenticated();
  }

  private signOut(): void {
    this.authService.signOut();
    this.router.navigate(['/home']);
  }
}
