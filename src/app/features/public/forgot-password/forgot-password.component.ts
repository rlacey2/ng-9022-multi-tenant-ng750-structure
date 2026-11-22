import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div style="max-width: 400px; margin: 4rem auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); text-align: center;">
      <h2 style="color: #1e3a8a; margin-top: 0;">Recover Credentials</h2>
      <p style="color: #475569; font-size: 0.95rem;">To test the ActivatedRoute URL extraction workflow, follow the link simulated below:</p>
      
      <div style="margin: 2rem 0; padding: 1rem; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; text-align: left;">
        <p style="margin-top: 0; font-weight: bold; color: #166534;">Simulated One-Time Email Action Link:</p>
        <a routerLink="/reset-password" [queryParams]="{ token: 'secured_demo_one_time_token_xyz123' }" style="color: #16a34a; font-weight: bold; word-break: break-all;">
          /reset-password?token=secured_demo_one_time_token_xyz123
        </a>
      </div>

      <a routerLink="/login" style="color: #64748b; text-decoration: none; font-size: 0.9rem;">Return back to login screen</a>
    </div>
  `
})
export class ForgotPasswordComponent {}
