import { Injectable, signal, computed, inject } from '@angular/core';
import { AuthApiService, UserProfile } from '../../modules/Auth/pages/login-page/services/auth-api.service';

/**
 * Current-user / session state. The access token lives in memory only (never localStorage) —
 * it is re-hydrated on app start from the httpOnly refresh_token cookie via tryRestoreSession().
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authApiService = inject(AuthApiService);

  private readonly _currentUser = signal<UserProfile | null>(null);
  private readonly _accessToken = signal<string | null>(null);

  readonly currentUser = this._currentUser.asReadonly();

  /** True once we hold an access token, independent of whether the profile fetch has resolved. */
  readonly isAuthenticated = computed<boolean>(() => !!this._accessToken());

  /** Kept as an alias so existing templates (`authService.isLoggedIn()`) keep working. */
  readonly isLoggedIn = this.isAuthenticated;

  /** Full display name — sourced from the profile (/me), never the raw user id. */
  readonly username = computed<string>(() => {
    const user = this._currentUser();
    return user ? [user.firstName, user.lastName].filter(Boolean).join(' ') : '';
  });

  getAccessToken(): string | null {
    return this._accessToken();
  }

  /** Sets the access token only, e.g. after a silent refresh — the current profile is left untouched. */
  setAccessToken(token: string): void {
    this._accessToken.set(token);
  }

  /** Store the token and fetch the profile behind it. Used after login and on session restore. */
  async establishSession(accessToken: string): Promise<void> {
    this._accessToken.set(accessToken);
    try {
      const profile = await this.authApiService.me();
      this._currentUser.set(profile);
    } catch {
      // The access token is still valid at this point — a transient /me failure shouldn't
      // block login. The profile will be picked up on the next session restore.
      this._currentUser.set(null);
    }
  }

  /** Exchange the httpOnly refresh_token cookie for a new access token, updating the signal. */
  async refreshAccessToken(): Promise<string> {
    const { access_token } = await this.authApiService.refresh();
    this._accessToken.set(access_token);
    return access_token;
  }

  /** Attempt to hydrate the session from the refresh cookie on app start. Never throws. */
  async tryRestoreSession(): Promise<void> {
    try {
      const token = await this.refreshAccessToken();
      await this.establishSession(token);
    } catch {
      this.clearSession();
    }
  }

  clearSession(): void {
    this._accessToken.set(null);
    this._currentUser.set(null);
  }
}
