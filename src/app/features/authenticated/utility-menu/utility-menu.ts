import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { AuthService } from "../../../core/auth/services/auth.service";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { RouterLink } from "@angular/router";
import { FormFieldSettingsDialogComponent } from "../../../core/services/formfieldoptions/dialog/form-field-settings-dialog";
import { MatDialog } from "@angular/material/dialog";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { WorkspaceSettingsService } from "../../../core/services/workspace-settings.service";

@Component({
  selector: 'app-utility-menu',
    templateUrl: './utility-menu.html',
      styleUrl: './utility-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatMenuModule, MatButtonModule, MatIconModule, RouterLink,     MatSlideToggleModule  ],

})

export class UtilityMenuComponent {
  private readonly authService = inject(AuthService);
    private readonly dialog = inject(MatDialog);
   protected settingsService = inject(WorkspaceSettingsService);
 
  protected readonly user = computed(() => this.authService.currentUser()); // adapt to your auth service

protected readonly dbTaskTabs = [
  { index: 0, label: 'Events List' },
  { index: 1, label: 'Organisations' },
  { index: 2, label: 'Email Errors' },
  { index: 3, label: 'Users' },
  { index: 4, label: 'Raw Views' },
  { index: 5, label: 'Message Centre' },
  { index: 6, label: 'Global Settings' },
  { index: 7, label: 'Email Test' },
  { index: 8, label: 'Reset Token' },
  { index: 9, label: 'CRM Alignment' },
  
] as const;
frame: any;



   openAppearanceSettings(): void {
      // move to navbar later
    this.dialog.open(FormFieldSettingsDialogComponent, {
      width: '460px',
      autoFocus: false,
    });
  }

  logout() {
    this.authService.logout()
  }


}