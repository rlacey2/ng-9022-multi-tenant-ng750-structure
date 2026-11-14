import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { COOKIE_FEATURES } from '../../../core/config/cookie.config';
import { CookieService } from '../../../core/services/cookie.service';
 

// 20261106: Root-level consent modal shared across all routes.
@Component({
  selector: 'app-cookie-guard',
  standalone: true,
  templateUrl: './cookie-guard.html',
  styleUrl: './cookie-guard.scss'
})
export class CookieGuardComponent {
  readonly cookieService = inject(CookieService);
  private readonly router = inject(Router);

  readonly analyticsFeatureEnabled = COOKIE_FEATURES.analytics;
  readonly marketingFeatureEnabled = COOKIE_FEATURES.marketing;

  // 20261106: After either choice, return to the protected route the user was trying to access.
  acceptAll(): void {
    this.cookieService.acceptAll();
    void this.returnToRequestedRoute();
  }

  // 20261106: Rejecting optional categories is still an explicit, completed consent decision.
  rejectNonEssential(): void {
    this.cookieService.rejectNonEssential();
    void this.returnToRequestedRoute();
  }

  // 20261106: When no optional categories are configured, require an explicit confirmation action.
  confirmEssentialOnly(): void {
    this.cookieService.rejectNonEssential();
    void this.returnToRequestedRoute();
  }

  private async returnToRequestedRoute(): Promise<void> {
    const returnUrl = this.cookieService.takePendingReturnUrl();
    await this.router.navigateByUrl(returnUrl);
  }
}
