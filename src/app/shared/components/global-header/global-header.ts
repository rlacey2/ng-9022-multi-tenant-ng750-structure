// src/app/shared/components/global-header/global-header.component.ts
import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
 
import { AuthService } from '../../../core/auth/services/auth.service';
import { WorkspaceSettingsService } from '../../../core/services/workspace-settings.service';
import { FallbackImgDirective } from '../../directives/fallback-img.directive';
import { ThemeService } from '../../../core/http/theme.service';
import { NavigationService } from '../../../core/services/navigation.service.ts';

@Component({
  selector: 'app-global-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './global-header.html'
})
export class GlobalHeaderComponent {
  protected themeService = inject(ThemeService);
  protected navService = inject(NavigationService);
  protected authService = inject(AuthService);
  protected settingsService = inject(WorkspaceSettingsService);

  // Event emitters for mobile sidebar triggers when elevated to Level 1
  toggleLeft = output<void>();
  toggleRight = output<void>();
}
