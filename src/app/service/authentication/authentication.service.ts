import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private authenticated: boolean = false;

  constructor() { }

  public login() {
    this.authenticated = true;
  }

  public logout() {
    this.authenticated = false;
  }

  public isAuthenticated(): boolean {
    return this.authenticated;
  }
}
