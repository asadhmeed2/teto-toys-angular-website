import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services';

/**
 * Attaches the Authorization: Bearer <token> header to every outgoing request
 * when the user has a valid access_token stored in localStorage.
 *
 * Skips injection if no token is present — unauthenticated requests pass through unchanged.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};
