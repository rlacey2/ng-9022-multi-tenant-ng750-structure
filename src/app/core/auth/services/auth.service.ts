import { Injectable, signal, computed } from '@angular/core';
import { UserProfile, AuthTokenPayload } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Reactive internal state signals
  private currentUserSignal = signal<UserProfile | null>(null);
  private tokenSignal = signal<string | null>(null);

  // Read-only state mappings exposed publicly
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.tokenSignal() !== null);

  constructor() {
    // Start with a mock active session by default so secure routes load on startup
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
  }

  logout() {
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);
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
