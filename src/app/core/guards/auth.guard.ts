// src/app/core/auth/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
 

export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect unauthenticated users to /login and pass the attempted URL as a query param
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};
