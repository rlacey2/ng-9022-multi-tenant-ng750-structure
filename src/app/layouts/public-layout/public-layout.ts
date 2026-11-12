import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/http/theme.service';
import { AuthService } from '../../core/auth/services/auth.service';
 
import { WorkspaceSettingsService } from '../../core/services/workspace-settings.service';
import { GlobalHeaderComponent } from '../../shared/components/global-header/global-header';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet,  FormsModule, GlobalHeaderComponent],
  templateUrl: './public-layout.html',
  styles: [`
    .sidebar-floating { position: absolute !important; background: white; transition: transform 0.25s ease-in-out; shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .sidebar-floating:not(.sidebar-open):not(.sidebar-open-right) { transform: translateX(-100%); }
    .sidebar-open { transform: translateX(0) !important; }
    .sidebar-open-right { transform: translateX(0) !important; position: absolute !important; }
    @media (max-width: 767.98px) {
      aside:not(.sidebar-open):not(.sidebar-open-right) { display: none !important; }
    }
  `] 
})

export class PublicLayoutComponent {
    protected settingsService = inject(WorkspaceSettingsService);
      
  authService = inject(AuthService)
  themeService = inject(ThemeService);
  leftSidebarOpen = signal(false);
  rightSidebarOpen = signal(false);
  headerLevelTriggers = true;
  overlayCloseAllowed = true;

  toggleLeftSidebar() { this.leftSidebarOpen.update(v => !v); }
  toggleRightSidebar() { this.rightSidebarOpen.update(v => !v); }
  closeBothSidebars() { this.leftSidebarOpen.set(false); this.rightSidebarOpen.set(false); }
  isMobile(): boolean { return typeof window !== 'undefined' && window.innerWidth < 768; }

  @HostListener('window:resize')
  onResize() { if (!this.isMobile()) { this.closeBothSidebars(); } }

 

}
