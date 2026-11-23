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
import { FormFieldSettingsDialogComponent } from '../../../core/services/formfieldoptions/dialog/form-field-settings-dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-global-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './global-header.html'
})
export class GlobalHeaderComponent {
     private readonly dialog = inject(MatDialog);
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



   openAppearanceSettings(): void {
      // move to navbar later
    this.dialog.open(FormFieldSettingsDialogComponent, {
      width: '460px',
      autoFocus: false,
    });
  }

}
