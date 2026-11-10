// src/app/core/services/workspace-settings.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WorkspaceSettingsService {
  readonly contextInspector = signal<boolean>(true);
  readonly runtimeVariableToggle = signal<boolean>(true);
  readonly headerLaunchButtons = signal<boolean>(false);
  readonly touchOverlayClose = signal<boolean>(true);

  toggleContextInspector() { this.contextInspector.update(v => !v); }
  toggleRuntimeVariableToggle() { this.runtimeVariableToggle.update(v => !v); }
  toggleHeaderLaunchButtons() { this.headerLaunchButtons.update(v => !v); }
  toggleTouchOverlayClose() { this.touchOverlayClose.update(v => !v); }
}
