import { Component, inject, computed } from '@angular/core';
import { SessionTimeoutService } from '../../../core/auth/services/session-timeout.service';

@Component({
  selector: 'app-timeout-modal',
  standalone: true,
  templateUrl: './timeout-modal.component.html' 
})
export class TimeoutModalComponent {
  public timeoutService = inject(SessionTimeoutService);
  protected formattedTime = computed(() => {
    const secs = this.timeoutService.countdownSeconds();
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  });
}
