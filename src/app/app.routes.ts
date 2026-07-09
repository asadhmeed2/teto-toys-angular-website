import { Routes } from '@angular/router';
import { authRedirectGuard } from './shared/guards';

export const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  {
    path: 'landing',
    loadComponent: () => import('./modules/landing').then((m) => m.LandingPageComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./modules/Auth').then((m) => m.LoginPageComponent),
    canActivate: [authRedirectGuard],
  },
  {
    path: 'signup',
    loadComponent: () => import('./modules/Auth').then((m) => m.SigninPageComponent),
    canActivate: [authRedirectGuard],
  },

  {
    path: 'forgot-password',
    loadComponent: () => import('./modules/Auth').then((m) => m.ForgotPasswordPageComponent),
    canActivate: [authRedirectGuard],
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./modules/Auth').then((m) => m.ResetPasswordPageComponent),
  },
];

