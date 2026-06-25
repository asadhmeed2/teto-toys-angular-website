import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  {
    path: 'landing',
    loadComponent: () => import('./modules/landing').then((m) => m.LandingPageComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./modules/Auth').then((m) => m.LoginPageComponent),
  },
  {
    path: 'admin',
    loadComponent: () => import('./modules/admin').then((m) => m.AdminLandingPageComponent),
  },
];

