import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  // private readonly baseUrl = 'http://localhost:8080/api/auth';
  private readonly baseUrl = 'http://localhost:8000/api/auth'; // flask api
  // private readonly baseUrl = 'http://localhost:3000/api/auth'; // node api
  private readonly http = inject(HttpClient);

  /** Login — browser automatically stores the refresh_token HTTP-only cookie from the response. */
  async login(email: string | null | undefined, password: string | null | undefined): Promise<any> {
    try {
      return await firstValueFrom(
        this.http.post(`${this.baseUrl}/login`, { email, password }, { withCredentials: true })
      );
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        throw new Error(err.error?.error_description || err.error?.error || err.message || 'Login failed');
      }
      throw err;
    }
  }

  /** Exchange the HTTP-only refresh_token cookie for a new access token. */
  async refresh(): Promise<any> {
    try {
      return await firstValueFrom(
        this.http.post(`${this.baseUrl}/refresh`, {}, { withCredentials: true })
      );
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        throw new Error(err.error?.error_description || err.error?.error || err.message || 'Token refresh failed');
      }
      throw err;
    }
  }

  /** Logout — backend clears the refresh_token cookie server-side. */
  async logout(): Promise<any> {
    try {
      return await firstValueFrom(
        this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true })
      );
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        throw new Error(err.error?.error_description || err.error?.error || err.message || 'Logout failed');
      }
      throw err;
    }
  }

  /** Verify the access token is still valid. Returns the user's email and role. */
  async me(token: string): Promise<{ email: string; role: string }> {
    try {
      return await firstValueFrom(
        this.http.get<{ email: string; role: string }>(`${this.baseUrl}/me`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        })
      );
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        throw new Error(err.error?.error_description || err.error?.error || err.message || 'Auth check failed');
      }
      throw err;
    }
  }
}
