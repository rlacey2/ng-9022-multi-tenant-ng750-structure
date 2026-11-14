// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout';
import { cookieConsentGuard } from './core/guards/cookie.guard';
import { authGuard } from './core/guards/auth.guard';
 

export const routes: Routes = [
  // 1. Unprotected /consent page sits outside guarded routes so it never loops
  {
    path: 'consent',
  // title: 'Cookie Consent', stays if enabled
    loadComponent: () =>
      import('./features/public/cookie-guard/cookie-guard').then(
        m => m.CookieGuardComponent
      )
  },

  // 2. Single unified layout shell for all root-level URLs (/events, /login, /cms, /admin)
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [cookieConsentGuard],
    canActivateChild: [cookieConsentGuard],
    children: [
      // Default landing redirect
      { path: '', redirectTo: 'events', pathMatch: 'full' },

      // Public routes (Protected only by cookieConsentGuard)
      {
        path: '',
        loadChildren: () =>
          import('./features/public/public.routes').then(m => m.PUBLIC_ROUTES)
      },

      // Authenticated routes at the same root level (/cms, /admin, /draft, /status)
      {
        path: '',
        canActivate: [authGuard],
        canActivateChild: [authGuard],
        loadChildren: () =>
          import('./features/authenticated/auth.routes').then(m => m.AUTH_ROUTES)
      }
    ]
  },

  // Catch-all fallback
  { path: '**', redirectTo: 'events' }
];
