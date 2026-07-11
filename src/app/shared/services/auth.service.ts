import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly isLoggedIn = signal<boolean>(false);
  private readonly _token = signal<string | null>(null);

  readonly username = computed<string>(() => {
    const token = this._token();
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.email ?? payload.sub ?? payload.name ?? '';
    } catch {
      return '';
    }
  });

  constructor() {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('access_token');
      this._token.set(token);
      this.isLoggedIn.set(!!token);
    }
  }

  setToken(token: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('access_token', token);
      this._token.set(token);
      this.isLoggedIn.set(true);
    }
  }

  clearToken(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('access_token');
      this._token.set(null);
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
