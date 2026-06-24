import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly baseUrl = 'http://localhost:8080/api/auth';
  private readonly http = inject(HttpClient);

  async login(email: string | null | undefined, password: string | null | undefined): Promise<any> {
    try {
      return await firstValueFrom(
        this.http.post(`${this.baseUrl}/login`, { email, password })
      );
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        throw new Error(err.error?.error_description || err.error?.error || err.message || 'Login failed');
      }
      throw err;
    }
  }

  async logout(token: string): Promise<any> {
    try {
      return await firstValueFrom(
        this.http.post(`${this.baseUrl}/logout`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      );
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        throw new Error(err.error?.error_description || err.error?.error || err.message || 'Logout failed');
      }
      throw err;
    }
  }
}
