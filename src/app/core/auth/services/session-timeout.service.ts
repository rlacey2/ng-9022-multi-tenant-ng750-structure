import { Injectable, inject, NgZone, signal, computed, effect } from '@angular/core';
import { AuthService } from './auth.service';
import { fromEvent, merge, Subscription, timer, interval } from 'rxjs';
import { switchMap, throttleTime, tap, take, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SessionTimeoutService {
  private authService = inject(AuthService);
  private ngZone = inject(NgZone);

     private readonly TIMEOUT_MS = 20 * 60 * 1000;
  //private readonly TIMEOUT_MS = 9900;
   private readonly WARNING_AT_MS = 18 * 60 * 1000;   // set 2 minutes less than IMEOUT_MS
 // private readonly WARNING_AT_MS = 6000;
    private readonly COUNTDOWN_DURATION_SEC = 2 * 60;
  // private readonly COUNTDOWN_DURATION_SEC = 4;


  private activitySubscription?: Subscription;
  private countdownSubscription?: Subscription;

  private readonly _showWarningModal = signal(false);
  private readonly _countdownSeconds = signal(0);

  readonly showWarningModal = computed(() => this._showWarningModal());
  readonly countdownSeconds = computed(() => this._countdownSeconds());

  private readonly STORAGE_KEY = 'last_activity_timestamp';


  constructor() {
    /*

    */

    effect(() => {
      /*
• Manual logout & cross-tab eviction: 
When logout() calls this.currentUser.set(null), stopTracking() runs immediately—even if AuthLayoutComponent
 hasn't finished destroying yet.
• Next login (without hard reload): 
When login sets this.currentUser.set(user), startTracking() runs automatically.
      */
      const user = this.authService.currentUser();
      if (user) {
        this.startTracking();
      } else {
        this.stopTracking();
      }
    });
  }



  startTracking(): void {
    this.stopTracking();
    this.authService.updateLastActivityTimestamp();

    this.ngZone.runOutsideAngular(() => {
      const activitySignals$ = merge(
        fromEvent(window, 'mousedown'),
        fromEvent(window, 'keydown'),
        fromEvent(window, 'scroll'),
        fromEvent(window, 'touchstart')
      ).pipe(
        throttleTime(2000),
        tap(() => {
          if (!this._showWarningModal()) {
            this.authService.updateLastActivityTimestamp();
          }
        }),
        //   Guarantees the timer starts immediately on login
        startWith(null), // Starts the timer immediately when startTracking() is called

        switchMap(() => timer(this.WARNING_AT_MS))
      );

      this.activitySubscription = activitySignals$.subscribe(() => {
        this.ngZone.run(() => this.triggerWarningCountdown());
      });
    });
  }

  /**
 * Resets the entire timer pipeline when the user manually clicks "Stay Logged In"
 */

  extendSession(): void {
    this._showWarningModal.set(false);
    this.stopCountdownTicker();
    this.authService.refreshToken().subscribe({
      next: () => this.startTracking(),
      error: () => this.handleFinalTimeout()
    });
  }

  stopTracking(): void {
    if (this.activitySubscription) this.activitySubscription.unsubscribe();
    this.stopCountdownTicker();
    this._showWarningModal.set(false);
  }

  private triggerWarningCountdown(): void {
    this._showWarningModal.set(true);
    this._countdownSeconds.set(this.COUNTDOWN_DURATION_SEC);
    if (this.activitySubscription) this.activitySubscription.unsubscribe();

    this.ngZone.runOutsideAngular(() => {
      this.countdownSubscription = interval(1000).pipe(
        take(this.COUNTDOWN_DURATION_SEC)
      ).subscribe({
        next: () => {
          this.ngZone.run(() => {
            this._countdownSeconds.update(val => val - 1);
            if (this._countdownSeconds() <= 0) {
              this.handleFinalTimeout();
            }
          });
        }
      });
    });
  }

  private stopCountdownTicker(): void {
    if (this.countdownSubscription) this.countdownSubscription.unsubscribe();
  }

  private handleFinalTimeout(): void {
    this.stopTracking();
    this.authService.logout();
  }

  isSessionExpired(lastActivityTimestamp: string | null): boolean {
    console.log('isSessionExpired')
    if (!lastActivityTimestamp) return false;

    const parsed = parseInt(lastActivityTimestamp, 10);
    if (isNaN(parsed)) return true; // Treat corrupted timestamps as expired

    return (Date.now() - parsed) > this.TIMEOUT_MS;
  }


  updateLastActivityTimestamp(): void {
    localStorage.setItem(this.STORAGE_KEY, Date.now().toString());
  }

  checkStoredSessionValidity(): boolean {
    console.log('checkStoredSessionValidity')
    const lastActivity = localStorage.getItem(this.STORAGE_KEY);
    if (!lastActivity) return false; // No active session to track
    // if (!lastActivity) return true; // Or false, depending on your rules

    const elapsed = Date.now() - parseInt(lastActivity, 10);
    if (elapsed > this.TIMEOUT_MS) {
      this.authService.logout(); // Handles clearing storage & state in one place
      return false;
    }
    return true;
  }



}
