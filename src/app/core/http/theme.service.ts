import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { AppInitService } from '../auth/services/appinit/appinit.service';

// src/app/core/services/theme.service.ts

export interface TenantMetaConfig {
  cId: string;
  name: string;
  environment: 'development' | 'production' | 'staging';
}

export interface TenantColorsConfig {
  primary: string;
  secondary: string;
  accent?: string;
  navbarStyle: 'light' | 'dark' | 'tenant-colored';
}

export interface TenantAssetsConfig {
  logoLargeUrl?: string;
  logoSmallUrl?: string;
}

// Master interface nesting the sub-objects together safely
export interface TenantTheme {
  meta: TenantMetaConfig;
  colors: TenantColorsConfig;
  assets: TenantAssetsConfig;
}


@Injectable({ providedIn: 'root' })
export class ThemeService {
  private http = inject(HttpClient);
  private document = inject(DOCUMENT);

  // 1. Core State Signal
private themeState = signal<TenantTheme | null>(null);
readonly currentTheme = this.themeState.asReadonly();

// 2. Multi-Level Computed Asset Locators
readonly logoLarge = computed(() => {
  const tenant = this.themeState();
  if (!tenant) return 'assets/default-logo-large.svg';
  return tenant.assets.logoLargeUrl || `assets/tenants/${tenant.meta.cId}/logo-large.svg`;
});

readonly logoSmall = computed(() => {
  const tenant = this.themeState();
  if (!tenant) return 'assets/default-logo-small.svg';
  return tenant.assets.logoSmallUrl || `assets/tenants/${tenant.meta.cId}/logo-small.svg`;
});

  
// 3. Dynamic Property Injector
constructor() {
  effect(() => {
    const theme = this.themeState();
    if (theme && typeof window !== 'undefined' && document.documentElement) {
      const root = document.documentElement;
      // Pulling cleanly from the nested configuration layers
      root.style.setProperty('--primary-color', theme.colors.primary);
      root.style.setProperty('--secondary-color', theme.colors.secondary);
    }
  });
  }

  tenant : any;


  private appInitService = inject(AppInitService);
 
  //  initTenantTheme(): Promise<boolean> {
  async initTenantTheme(): Promise<boolean> {
    
    // 1. Must succeed first so cId / companyDetails are populated
    this.tenant  =  await this.appInitService.init();

    // 2. Apply tenant theme using the loaded data
    // await this.applyThemeForTenant(this.appInitService.appConfig);

  
    this.loadMockTheme(this.tenant['cId']);
    return Promise.resolve(true);
  }

  loadTenantTheme(cId: string): void {
    this.loadMockTheme(cId);
  }

// Inside src/app/core/services/theme.service.ts

private loadMockTheme(cId: string): void {
  const mocks: Record<string, TenantTheme> = {
    'jmb001': {
      meta: {
        cId: cId,
        name: 'JMB LIVE',
        environment: 'production'
      },
      colors: {
        primary: '#ff5722',     // Vivid Orange
        secondary: '#3f51b5',   // Royal Deep Blue
        navbarStyle: 'tenant-colored'
      },
      assets: {
        // Fallback to local files if omitted, or pass explicit strings here
        logoLargeUrl: '',
        logoSmallUrl: ''
      }
    },

    'jmbtest': {
        meta: {
         cId: cId,
        name: 'JMB TEST',
        environment: 'production'
      },
      colors: {
        primary: '#00cc99',     // Bright Mint/Teal
        secondary: '#2b2b2b',   // Solid Dark Gray
        navbarStyle: 'dark'
      },
      assets: {
        logoLargeUrl: 'https://placehold.co',
        logoSmallUrl: 'https://placehold.co'
      }
    },

    'register101': {
        meta: {
         cId: cId,
        name: 'register101',
        environment: 'production'
      },
      colors: {
        primary: '#00cc99',     // Bright Mint/Teal
        secondary: '#2b2b2b',   // Solid Dark Gray
        navbarStyle: 'dark'
      },
      assets: {
        logoLargeUrl: 'https://placehold.co',
        logoSmallUrl: 'https://placehold.co'
      }
    }


  };

  // Safe runtime execution fallback selector
  this.themeState.set(mocks[cId] || mocks['tenant-a']);
}

}
