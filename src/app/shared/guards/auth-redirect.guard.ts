import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services';
import { AuthApiService } from '../../modules/Auth/pages/login-page/services/auth-api.service';

/**
 * Redirects already-authenticated users away from the /login page to /landing.
 * Validates the stored access_token against GET /api/auth/me.
 * On API failure (expired/invalid token) clears the stale token and allows access.
 */
export const authRedirectGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const authApiService = inject(AuthApiService);
  const router = inject(Router);

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  if (!token) {
    return true; // No token — allow access to /login
  }

  try {
    await authApiService.me(token);
    // Token is valid — user is already logged in, redirect away from /login
    return router.createUrlTree(['/landing']);
  } catch {
    // Token invalid or expired — clear it and allow access to /login
    authService.clearToken();
    return true;
  }
};
