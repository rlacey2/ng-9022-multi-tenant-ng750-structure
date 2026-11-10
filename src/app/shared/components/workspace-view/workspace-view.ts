// src/app/shared/components/workspace-view/workspace-view.component.ts
import { Component, input, signal, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceSettingsService } from '../../../core/services/workspace-settings.service';

@Component({
  selector: 'app-workspace-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workspace-view.html',
  styleUrls: ['./workspace-view.scss']
})
export class WorkspaceViewComponent {
  // Configuration Structural Inputs
  pageTitle = input<string>('Workspace Node');
  hasLeftSidebar = input<boolean>(true);
  hasRightSidebar = input<boolean>(true); // Enforce true to house our premium setting module

  // Transformed Configuration States managed as internal live signals
  headerLevelTriggers = signal<boolean>(false);
  overlayCloseAllowed = signal<boolean>(true);
  showInspector = signal<boolean>(true);

  // Responsive Layout States
  isMobile = signal<boolean>(false);
  leftSidebarOpen = signal<boolean>(false);
  rightSidebarOpen = signal<boolean>(false);

    // Inner views inject the exact same service instance to read layout configurations
  protected globalSettings = inject(WorkspaceSettingsService);
  
  // Now your template can use globalSettings.touchOverlayClose() or globalSettings.contextInspector()
 
 


  constructor() {
    this.checkScreenSize();
  }

@HostListener('window:resize', ['$event'])
onResize(event: UIEvent) { // 👈 Add the parameter here
  console.log(event);
}
  private checkScreenSize() {
    if (typeof window !== 'undefined') {
      const mobileState = window.innerWidth < 992; // Bootstrap lg breakpoint threshold
      this.isMobile.set(mobileState);
      
      if (mobileState) {
        this.leftSidebarOpen.set(false);
        this.rightSidebarOpen.set(false);
      }
    }
  }

  // Toggles for Layout Actions
  toggleLeft() { this.leftSidebarOpen.update(v => !v); }
  toggleRight() { this.rightSidebarOpen.update(v => !v); }

  // Toggles for Hidden Settings Feature Controls
  toggleHeaderTriggers() { this.headerLevelTriggers.update(v => !v); }
  toggleOverlayClose() { this.overlayCloseAllowed.update(v => !v); }
  toggleInspector() { this.showInspector.update(v => !v); }

  handleOverlayClick() {
    if (this.overlayCloseAllowed()) {
      this.leftSidebarOpen.set(false);
      this.rightSidebarOpen.set(false);
    }
  }
}
