import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly isLoggedIn = signal<boolean>(false);

  constructor() {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.isLoggedIn.set(!!localStorage.getItem('access_token'));
    }
  }

  setToken(token: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('access_token', token);
      this.isLoggedIn.set(true);
    }
  }

  clearToken(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('access_token');
      this.isLoggedIn.set(false);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('access_token');
    }
    return null;
  }
}
