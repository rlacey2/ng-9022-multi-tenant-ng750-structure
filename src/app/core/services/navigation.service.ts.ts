// src/app/core/services/navigation.service.ts
import { Injectable, inject, computed } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { AppNavigationLink } from '../../shared/models/shared.models';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private authService = inject(AuthService);

  // Single source of truth for all application header links
  private readonly allLinks: AppNavigationLink[] = [
    { label: '📅 Events', path: '/events/training', visibility: 'always' },
    { label: '🔑 Login', path: '/login', visibility: 'publicOnly' },

    { label: 'Status', path: '/secure/status', visibility: 'authenticatedOnly' },
    { label: 'CMS', path: '/secure/cms', visibility: 'authenticatedOnly' },

    { label: 'Admin', path: '/secure/admin', visibility: 'authenticatedOnly' },
    { label: 'Draft', path: '/secure/draft', visibility: 'authenticatedOnly' },
    { label: '⚙️ Settings', path: '/secure/useraccount', visibility: 'authenticatedOnly' } 
  ];

  // Automatically updates whenever authService.isAuthenticated() changes
  readonly visibleLinks = computed(() => {
    const isLoggedIn = this.authService.isAuthenticated();

    return this.allLinks.filter(link => {
      if (link.visibility === 'always') return true;
      if (link.visibility === 'publicOnly') return !isLoggedIn;
      if (link.visibility === 'authenticatedOnly') return isLoggedIn;
      return false;
    });
  });
}
