// src/app/layouts/auth-layout/auth-layout.component.ts
import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
 
import {  WorkspaceSettingsService } from '../../core/services/workspace-settings.service';
 
import { FallbackImgDirective } from '../../shared/directives/fallback-img.directive';
import { TenantService } from '../../core/http/tenant.service';
import { AuthService } from '../../core/auth/services/auth.service';
import { AppNavigationLink } from '../../shared/models/shared.models';
import { GlobalHeaderComponent } from '../../shared/components/global-header/global-header';
import { NavigationService } from '../../core/services/navigation.service.ts';
import { SessionTimeoutService } from '../../core/auth/services/session-timeout.service';
import { TimeoutModalComponent } from '../../shared/components/timeout-modal/timeout-modal.component';
 
@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterModule,  GlobalHeaderComponent, TimeoutModalComponent],
  templateUrl: './auth-layout.html',
  styleUrls: ['./auth-layout.scss']
})

export class AuthLayoutComponent {

  protected TenantService = inject(TenantService);
  protected settingsService = inject(WorkspaceSettingsService);
  protected authService = inject(AuthService);
   private timeoutService = inject(SessionTimeoutService);
   

  // Responsive layout state tracking signals
  isMobile = signal<boolean>(false);
  leftSidebarOpen = signal<boolean>(false);
  rightSidebarOpen = signal<boolean>(false);

 
/*
Only track inactivity while the user is logged into the application. 
Tracking while they are on the public landing page or login screen wastes CPU cycles.
By initiating tracking inside your AuthLayoutComponent's lifecycle hook, the monitoring automatically 
activates the moment they pass the authGuard and shuts down cleanly the moment they leave.

*/


  constructor() {
    this.checkScreenSize();
  }

  ngOnInit(): void {
   // this.timeoutService.startTracking(); covered by SessionTimeoutService effect in constructor
       
  }

  ngOnDestroy(): void {
  //  this.timeoutService.stopTracking(); // this.timeoutService.startTracking(); covered by SessionTimeoutService effect in constructor
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
