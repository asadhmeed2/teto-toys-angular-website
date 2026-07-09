import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { parseHttpError } from '../../../../../shared/utils/error';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly baseUrl = 'http://localhost:8080/api/auth';
  // private readonly baseUrl = 'http://localhost:8000/api/auth'; // flask api
  // private readonly baseUrl = 'http://localhost:3000/api/auth'; // node api
  private readonly http = inject(HttpClient);

  /** Login — browser automatically stores the refresh_token HTTP-only cookie from the response. */
  async login(email: string | null | undefined, password: string | null | undefined): Promise<any> {
    try {
      return await firstValueFrom(
        this.http.post(`${this.baseUrl}/login`, { email, password }, { withCredentials: true })
      );
    } catch (err) {
      throw parseHttpError(err, 'Login failed');
    }
  }

  /** Exchange the HTTP-only refresh_token cookie for a new access token. */
  async refresh(): Promise<any> {
    try {
      return await firstValueFrom(
        this.http.post(`${this.baseUrl}/refresh`, {}, { withCredentials: true })
      );
    } catch (err) {
      throw parseHttpError(err, 'Token refresh failed');
    }
  }

  /** Logout — backend clears the refresh_token cookie server-side. */
  async logout(): Promise<any> {
    try {
      return await firstValueFrom(
        this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true })
      );
    } catch (err) {
      throw parseHttpError(err, 'Logout failed');
    }
  }

  /** Verify the access token is still valid. Returns the user's email and role. */
  async me(token: string): Promise<{ email: string; role: string }> {
    try {
      return await firstValueFrom(
        this.http.get<{ email: string; role: string }>(`${this.baseUrl}/me`, {
          withCredentials: true,
        })
      );
    } catch (err) {
      throw parseHttpError(err, 'Auth check failed');
    }
  }

  /** Register a new user account. */
  async register(payload: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password: string;
    is_adult: boolean;
    terms_accepted: boolean;
    marketing_opt_in: boolean;
  }): Promise<any> {
    try {
      return await firstValueFrom(
        this.http.post(`${this.baseUrl}/register`, payload, { withCredentials: true })
      );
    } catch (err) {
      throw parseHttpError(err, 'Registration failed');
    }
  }

  /** Send a password reset email. Always resolves — never reveals if the email exists. */
  async forgotPassword(email: string): Promise<any> {
    try {
      return await firstValueFrom(
        this.http.post(`${this.baseUrl}/forgot-password`, { email }, { withCredentials: true })
      );
    } catch (err) {
      throw parseHttpError(err, 'Request failed');
    }
  }

  /** Reset password using the token from the email link. */
  async resetPassword(token: string, new_password: string, confirm_password: string): Promise<any> {
    try {
      return await firstValueFrom(
        this.http.post(`${this.baseUrl}/reset-password`, { token, new_password, confirm_password }, { withCredentials: true })
      );
    } catch (err) {
      throw parseHttpError(err, 'Password reset failed');
    }
  }
}
