import { Injectable, signal, computed, inject } from '@angular/core';
import { UserProfile, AuthTokenPayload } from '../models/auth.models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private router = inject(Router);
  // Reactive internal state signals
  private currentUserSignal = signal<UserProfile | null>(null);
  private tokenSignal = signal<string | null>(null);

  // Read-only state mappings exposed publicly
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.tokenSignal() !== null);

  constructor() {
    // Start with a mock active session by default so secure routes load on startup
    console.log('logout at start or here  this.simulateMockLogin()')
    this.simulateMockLogin();
  }

  simulateMockLogin() {
    this.tokenSignal.set('mock-jwt-token-string');
    this.currentUserSignal.set({
      id: 'USR-7721',
      username: 'rl Lacey',
      email: 'rlacey@system-node.internal',
      role: 'Admin'
    });
     this.router.navigate(['/app/status']);
  }

  logout() {
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);

        // Redirect immediately to the login component upon logout
    this.router.navigate(['/login']);
  }

  // Handy runtime helper for testing responsive menu flags directly on screen canvases
  toggleAuthenticationState() {
    if (this.isAuthenticated()) {
      this.logout();
    } else {
      this.simulateMockLogin();
    }
  }
}
