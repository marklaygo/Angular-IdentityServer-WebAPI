import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  public saveUserProfile(profile: string): void {
    localStorage.setItem('user_profile', profile);
  }

  public getUserProfile(): string {
    return localStorage.getItem('user_profile');
  }

  public getUserEmail(): string {
    let userProfile: any = JSON.parse(this.getUserProfile());
    return userProfile.name;
  }
}
