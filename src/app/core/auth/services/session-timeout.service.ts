import { Injectable, inject, NgZone, signal, computed } from '@angular/core';
import { AuthService } from './auth.service';
import { fromEvent, merge, Subscription, timer, interval } from 'rxjs';
import { switchMap, throttleTime, tap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SessionTimeoutService {
  private authService = inject(AuthService);
  private ngZone = inject(NgZone);

  private readonly TIMEOUT_MS = 15 * 60 * 1000;
  private readonly WARNING_AT_MS = 13 * 60 * 1000;
  private readonly COUNTDOWN_DURATION_SEC = 2 * 60;

  private activitySubscription?: Subscription;
  private countdownSubscription?: Subscription;

  private readonly _showWarningModal = signal(false);
  private readonly _countdownSeconds = signal(0);

  readonly showWarningModal = computed(() => this._showWarningModal());
  readonly countdownSeconds = computed(() => this._countdownSeconds());

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
        switchMap(() => timer(this.WARNING_AT_MS))
      );

      this.activitySubscription = activitySignals$.subscribe(() => {
        this.ngZone.run(() => this.triggerWarningCountdown());
      });
    });
  }

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
}
