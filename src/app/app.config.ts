// app.config.ts
import { ApplicationConfig, provideAppInitializer, inject, provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, withDebugTracing, withRouterConfig } from '@angular/router';
import { routes } from './app.routes';
import { TenantService } from './core/http/tenant.service';
import { CookieService } from './core/services/cookie.service';
import { provideSignalFormFieldOptions } from './core/services/formfieldoptions/form-field-preferences.service';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { SessionTimeoutService } from './core/auth/services/session-timeout.service';

export const appConfig: ApplicationConfig = {
  providers: [

    provideZonelessChangeDetection(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-IE' },
    provideNativeDateAdapter(),


    provideHttpClient(),
    provideRouter(routes,  
      // withDebugTracing(),
     withComponentInputBinding(),
       withRouterConfig({ paramsInheritanceStrategy: 'always' })
    ),
    provideAppInitializer(() => {
      const tenantService = inject(TenantService);
      const cookieService = inject(CookieService);
      return tenantService.initTenantTheme(); //  // BOOT STRAP TO SERVER TO GET cId etc
    }),
 

        //   Validate stored session & start tracking if valid
    provideAppInitializer(() => {
      const sessionService = inject(SessionTimeoutService);
      const isValid = sessionService.checkStoredSessionValidity();
      
      if (isValid) {
        sessionService.startTracking();
      }
    }),

    provideSignalFormFieldOptions()




    /*
    there can be multiples
    provideAppInitializer(() => inject(AppInitService).Init()),
    provideAppInitializer(() => inject(TenantService).initTenantTheme()),
    */

  ]
}; 
