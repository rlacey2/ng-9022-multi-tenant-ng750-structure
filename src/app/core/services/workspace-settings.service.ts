// src/app/core/services/workspace-settings.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WorkspaceSettingsService {
  readonly contextInspector = signal<boolean>(true);
  readonly runtimeVariableToggle = signal<boolean>(true);
  readonly headerLaunchButtons = signal<boolean>(false);
  readonly touchOverlayClose = signal<boolean>(true);

  // Counters used to broadcast header button clicks to the active workspace view
  readonly leftTriggerCount = signal<number>(0);
  readonly rightTriggerCount = signal<number>(0);

  toggleContextInspector() { this.contextInspector.update(v => !v); }
  toggleRuntimeVariableToggle() { this.runtimeVariableToggle.update(v => !v); }
  toggleHeaderLaunchButtons() { this.headerLaunchButtons.update(v => !v); }
  toggleTouchOverlayClose() { this.touchOverlayClose.update(v => !v); }

  triggerLeftSidebar() { this.leftTriggerCount.update(c => c + 1); }
  triggerRightSidebar() { this.rightTriggerCount.update(c => c + 1); }
}
