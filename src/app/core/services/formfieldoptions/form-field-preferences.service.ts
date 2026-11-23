// form-field-preferences.service.ts
import { Injectable, Provider, WritableSignal, computed, effect, inject, signal } from '@angular/core';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldAppearance,
  MatFormFieldDefaultOptions,
  SubscriptSizing,
} from '@angular/material/form-field';
 
const STORAGE_KEY = 'user_form_field_options';

const DEFAULT_OPTIONS: Required<Pick<MatFormFieldDefaultOptions, 'appearance' | 'subscriptSizing'>> = {
  appearance: 'fill',
  subscriptSizing: 'dynamic',
};

   /*
    {
      /*
      If you want 'dynamic' (or 'fixed') to be the default across your entire application without 
      repeating the attribute on every <mat-form-field>
      * /

      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
     //   subscriptSizing: 'fixed',  // dynamic | fixed
    //    appearance: 'outline',       // outline | fill
        subscriptSizing: 'dynamic',  // dynamic | fixed
        appearance: 'fill',       // outline | fill
      },
    },
    */


export function provideSignalFormFieldOptions(): Provider {
  return {
    provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
    useFactory: () => {
      const prefs = inject(FormFieldPreferencesService);
      // Getters ensure MatFormField reads the current signal value at instantiation time
      return {
        get appearance() {
          return prefs.appearance();
        },
        get subscriptSizing() {
          return prefs.subscriptSizing();
        },
      } satisfies MatFormFieldDefaultOptions;
    },
  };
}


export type FormFieldDensity = 'comfortable' | 'normal' | 'compact' | 'small';

const DENSITY_STYLES: Record<FormFieldDensity, { height: string; padding: string }> = {
  comfortable: { height: '56px', padding: '16px' }, // Material default
  normal:      { height: '48px', padding: '12px' },
  compact:     { height: '40px', padding: '8px'  },
  small:       { height: '34px', padding: '4px'  },
};

//  , --mat-icon-button-container-shape: unset



const DEFAULTS = {
  appearance: 'fill' as MatFormFieldAppearance,
  subscriptSizing: 'dynamic' as SubscriptSizing,
  density: 'comfortable' as FormFieldDensity,
};
 
@Injectable({ providedIn: 'root' })
export class FormFieldPreferencesService {
  readonly appearance: WritableSignal<MatFormFieldAppearance> = signal(DEFAULTS.appearance);
  readonly subscriptSizing: WritableSignal<SubscriptSizing> = signal(DEFAULTS.subscriptSizing);
  readonly density: WritableSignal<FormFieldDensity> = signal(DEFAULTS.density);

  readonly isDefault = computed(
    () =>
      this.appearance() === DEFAULTS.appearance &&
      this.subscriptSizing() === DEFAULTS.subscriptSizing &&
      this.density() === DEFAULTS.density
  );

  constructor() {
    this.loadFromStorage();
 
    // Keep CSS variables reactive so live preview works while dialog is open
    effect(() => {
      const currentDensity: FormFieldDensity = this.density();
      const styles = DENSITY_STYLES[currentDensity];
      const root = document.documentElement.style;

      root.setProperty('--mat-form-field-container-height', styles.height);
      root.setProperty('--mat-form-field-filled-with-label-container-padding-top', styles.padding);
      root.setProperty('--mat-form-field-filled-with-label-container-padding-bottom', styles.padding);
      root.setProperty('--mat-form-field-container-vertical-padding', styles.padding);
    });
  }

  /** Reverts signals in memory without writing to localStorage yet */
  reset(): void {
    this.appearance.set(DEFAULTS.appearance);
    this.subscriptSizing.set(DEFAULTS.subscriptSizing);
    this.density.set(DEFAULTS.density);
  }

  /** Explicitly persists current signal state to localStorage */
  save(): void {
    if (this.isDefault()) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          appearance: this.appearance(),
          subscriptSizing: this.subscriptSizing(),
          density: this.density(),
        })
      );
    }
  }

  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.appearance) this.appearance.set(parsed.appearance);
      if (parsed.subscriptSizing) this.subscriptSizing.set(parsed.subscriptSizing);
      if (parsed.density) this.density.set(parsed.density);
    } catch {
      // Ignore malformed storage
    }
  }
}




