import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) return true;

  return authService.refreshToken().pipe(
    take(1),
    map((token) => {
      if (token) return true;
      return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }),
    catchError(() => of(router.createUrlTree(['/login'])))
  );
};
