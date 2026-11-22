import { ApplicationConfig, provideAppInitializer, inject } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { TenantService } from './core/http/tenant.service';
import { CookieService } from './core/services/cookie.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideAppInitializer(() => {
      const tenantService = inject(TenantService);
      const cookieService = inject(CookieService);
      return tenantService.initTenantTheme(); //  // BOOT STRAP TO SERVER TO GET cId etc
    })

    /*
    there can be multiples
    provideAppInitializer(() => inject(AppInitService).Init()),
    provideAppInitializer(() => inject(TenantService).initTenantTheme()),
    */

  ]
}; 
