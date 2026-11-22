// src/app/shared/components/global-header/global-header.component.ts
import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
 
import { AuthService } from '../../../core/auth/services/auth.service';
import { WorkspaceSettingsService } from '../../../core/services/workspace-settings.service';
import { FallbackImgDirective } from '../../directives/fallback-img.directive';
import { TenantService } from '../../../core/http/tenant.service';
import { NavigationService } from '../../../core/services/navigation.service.ts';
import { CookieService } from '../../../core/services/cookie.service';

@Component({
  selector: 'app-global-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './global-header.html'
})
export class GlobalHeaderComponent {
  protected TenantService = inject(TenantService);
  protected navService = inject(NavigationService);
  protected authService = inject(AuthService);
  protected settingsService = inject(WorkspaceSettingsService);

  private readonly cookieService = inject(CookieService);
  private readonly router = inject(Router);


  // Event emitters for mobile sidebar triggers when elevated to Level 1
  toggleLeft = output<void>();
  toggleRight = output<void>();

   // Define resetCookies() directly inside GlobalHeaderComponent
  resetCookies(): void {
    this.cookieService.resetConsent(this.router.url);
    this.router.navigate(['/consent']);
  }
}
