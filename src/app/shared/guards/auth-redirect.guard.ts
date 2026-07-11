import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services';

/**
 * Redirects already-authenticated users away from the /login page to /landing.
 * Session state is hydrated from the refresh cookie before routing starts (see
 * tryRestoreSession() in APP_INITIALIZER), so this is a synchronous signal read —
 * no network round-trip needed here.
 */
export const authRedirectGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated() ? router.createUrlTree(['/landing']) : true;
};
