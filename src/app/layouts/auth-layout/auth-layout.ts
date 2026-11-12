// src/app/layouts/auth-layout/auth-layout.component.ts
import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
 
import {  WorkspaceSettingsService } from '../../core/services/workspace-settings.service';
 
import { FallbackImgDirective } from '../../shared/directives/fallback-img.directive';
import { ThemeService } from '../../core/http/theme.service';
import { AuthService } from '../../core/auth/services/auth.service';
import { AppNavigationLink } from '../../shared/models/shared.models';
import { GlobalHeaderComponent } from '../../shared/components/global-header/global-header';
import { NavigationService } from '../../core/services/navigation.service.ts';
 
@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterModule,  GlobalHeaderComponent],
  templateUrl: './auth-layout.html',
  styleUrls: ['./auth-layout.scss']
})

export class AuthLayoutComponent {

  protected themeService = inject(ThemeService);
  protected settingsService = inject(WorkspaceSettingsService);
  protected authService = inject(AuthService);
   

  // Responsive layout state tracking signals
  isMobile = signal<boolean>(false);
  leftSidebarOpen = signal<boolean>(false);
  rightSidebarOpen = signal<boolean>(false);

 
  constructor() {
    this.checkScreenSize();
  }

@HostListener('window:resize', ['$event'])
onResize(event: UIEvent) { // 👈 Add the parameter here
  console.log(event);
}
  private checkScreenSize() {
    if (typeof window !== 'undefined') {
      const mobileState = window.innerWidth < 992;
      this.isMobile.set(mobileState);
      if (!mobileState) {
        this.closeBothSidebars();
      }
    }
  }

  toggleLeftSidebar() {
    this.leftSidebarOpen.update(v => !v);
    if (this.leftSidebarOpen()) this.rightSidebarOpen.set(false);
  }

  toggleRightSidebar() {
    this.rightSidebarOpen.update(v => !v);
    if (this.rightSidebarOpen()) this.leftSidebarOpen.set(false);
  }

  closeBothSidebars() {
    this.leftSidebarOpen.set(false);
    this.rightSidebarOpen.set(false);
  }
}
