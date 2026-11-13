// src/app/core/services/workspace-settings.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WorkspaceSettingsService {
  readonly contextInspector = signal<boolean>(true);
  readonly runtimeVariableToggle = signal<boolean>(true);
  readonly headerLaunchButtons = signal<boolean>(false);
  readonly touchOverlayClose = signal<boolean>(true);

  // Tracks exact sidebar presence on whichever page is currently rendered
  readonly activeLeftSidebar = signal<boolean>(false);
  readonly activeRightSidebar = signal<boolean>(false);

  readonly leftTriggerCount = signal<number>(0);
  readonly rightTriggerCount = signal<number>(0);

  toggleContextInspector() { this.contextInspector.update(v => !v); }
  toggleRuntimeVariableToggle() { this.runtimeVariableToggle.update(v => !v); }
  toggleHeaderLaunchButtons() { this.headerLaunchButtons.update(v => !v); }
  toggleTouchOverlayClose() { this.touchOverlayClose.update(v => !v); }

  setSidebarPresence(left: boolean, right: boolean) {
    this.activeLeftSidebar.set(left);
    this.activeRightSidebar.set(right);
  }

  triggerLeftSidebar() { this.leftTriggerCount.update(c => c + 1); }
  triggerRightSidebar() { this.rightTriggerCount.update(c => c + 1); }
}
