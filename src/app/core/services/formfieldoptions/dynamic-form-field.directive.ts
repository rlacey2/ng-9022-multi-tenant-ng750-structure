/*
You can create a standalone attribute directive that targets the mat-form-field selector directly. 
Because Angular automatically matches directives to any element with that tag name, you won't even need
 to add a custom attribute to your HTML—just import the directive into your component (or shared module),
  and every <mat-form-field> inside it will automatically stay synced with your Signals in real time.

1. Create the Auto-Sync Directive


*/

// dynamic-form-field.directive.ts
import { Directive, effect, inject } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { FormFieldPreferencesService } from './form-field-preferences.service';

@Directive({
  // Automatically attaches to every <mat-form-field> where this directive is imported
  // Skips any <mat-form-field noDynamicStyle>
  selector: 'mat-form-field:not([noDynamicStyle])',
  standalone: true,
})
export class DynamicFormFieldDirective {
  private readonly formField = inject(MatFormField);
  private readonly prefs = inject(FormFieldPreferencesService);

  constructor() {
    effect(() => {
      this.formField.appearance = this.prefs.appearance();
      this.formField.subscriptSizing = this.prefs.subscriptSizing();
    });
  }
}
