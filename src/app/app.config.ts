import { ApplicationConfig, provideAppInitializer, inject } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { ThemeService } from './core/http/theme.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideAppInitializer(() => {
      const themeService = inject(ThemeService);
      return themeService.initTenantTheme();
    })
  ]
};
