import { Routes } from '@angular/router';

 

export const PUBLIC_ROUTES: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', loadComponent: () => import('./landing/landing').then(m => m.LandingComponent) },
  { path: 'login', loadComponent: () => import('./login/login').then(m => m.LoginComponent) },
  { path: 'forgot-password', loadComponent: () => import('./forgot-password/forgot-password').then(m => m.ForgotPasswordComponent) },
  { path: 'reset-password', loadComponent: () => import('./reset-password/reset-password').then(m => m.ResetPasswordComponent) }
];
