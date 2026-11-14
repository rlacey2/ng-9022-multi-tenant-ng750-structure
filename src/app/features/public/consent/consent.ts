import { Component, inject } from '@angular/core';
import { CookieService } from '../../../core/services/cookie.service';
 

// 20261106: Entering this route always forces the overlay to request a fresh explicit decision.
// 20261106: This also preserves the prompt if the browser reloads while the user is on /consent.
@Component({
  selector: 'app-consent',
  standalone: true,
  templateUrl: './consent.html'
})
export class ConsentComponent {
  private readonly cookieService = inject(CookieService);

  constructor() {
    this.cookieService.requireFreshConsentDecision();
  }
}
