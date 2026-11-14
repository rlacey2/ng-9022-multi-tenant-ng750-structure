import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from '../services/cookie.service';


// 20261106: A deliberate accept or reject choice both count as a completed consent decision.
// 20261106: Redirect to the unprotected consent route and retain the originally requested URL.
export const cookieConsentGuard: CanActivateFn = (_route, state) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);

  if (cookieService.hasChosenConsent()) return true;

  cookieService.setPendingReturnUrl(state.url);
  return router.createUrlTree(['/consent']);
};
