import { Routes } from '@angular/router';

 

export const PUBLIC_ROUTES: Routes = [ 
  { path: '', redirectTo: 'events', pathMatch: 'full' },
  { path: 'events', loadComponent: () => import('./events/events').then(m => m.EventsComponent) },
  { path: 'login', loadComponent: () => import('./login/login').then(m => m.LoginComponent) },
  { path: 'forgot-password', loadComponent: () => import('./forgot-password/forgot-password').then(m => m.ForgotPasswordComponent) },
  { path: 'reset-password', loadComponent: () => import('./reset-password/reset-password').then(m => m.ResetPasswordComponent) }
];
