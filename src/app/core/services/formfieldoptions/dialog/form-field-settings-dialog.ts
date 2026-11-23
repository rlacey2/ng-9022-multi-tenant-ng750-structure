// form-field-settings-dialog.component.ts
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldAppearance, MatFormFieldModule, SubscriptSizing } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DynamicFormFieldDirective } from '../dynamic-form-field.directive';
import { FormFieldDensity, FormFieldPreferencesService } from '../form-field-preferences.service';
 
@Component({
  selector: 'app-form-field-settings-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    DynamicFormFieldDirective,
  ],

  templateUrl: './form-field-settings-dialog.html',
  styleUrl: './form-field-settings-dialog.scss',

 
})
export class FormFieldSettingsDialogComponent {

    // apply directive noDynamicStyle if these preferences are to be ignored on a mat-form-field
    // can also inject 
     //readonly prefs = inject(FormFieldPreferencesService);

    // and use   [appearance]="prefs.appearance()" [subscriptSizing]="prefs.subscriptSizing()"

  readonly prefs = inject(FormFieldPreferencesService);

private readonly dialogRef = inject(MatDialogRef<FormFieldSettingsDialogComponent>);


 // Snapshot the initial state when the dialog opens
  private readonly initialSnapshot: {
    appearance: MatFormFieldAppearance;
    subscriptSizing: SubscriptSizing;
    density: FormFieldDensity;
  };

  private committed = false;

  // True only when at least one setting differs from when the dialog opened
  readonly hasChanges = computed(
    () =>
      this.prefs.appearance() !== this.initialSnapshot.appearance ||
      this.prefs.subscriptSizing() !== this.initialSnapshot.subscriptSizing ||
      this.prefs.density() !== this.initialSnapshot.density
  );



  constructor() {
    this.initialSnapshot = {
      appearance: this.prefs.appearance(),
      subscriptSizing: this.prefs.subscriptSizing(),
      density: this.prefs.density(),
    };





    // Also revert if the user closes via backdrop click or Escape key
    this.dialogRef.beforeClosed().subscribe(() => {
      if (!this.committed) {
        this.restoreSnapshot();
      }
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

save(): void {
  this.prefs.save();
  this.committed = true;
  this.dialogRef.close(true);
}

  private restoreSnapshot(): void {
    this.prefs.appearance.set(this.initialSnapshot.appearance);
    this.prefs.subscriptSizing.set(this.initialSnapshot.subscriptSizing);
    this.prefs.density.set(this.initialSnapshot.density);
  }
}