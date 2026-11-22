import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div style="max-width: 400px; margin: 4rem auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
      <h2 style="color: #1e3a8a; margin-top:0; text-align: center;">Define New Password</h2>
      
      @if (token()) {
        <p style="background: #eff6ff; color: #1d4ed8; padding: 0.5rem; border-radius: 4px; font-size: 0.85rem; word-break: break-all;">
          <strong>Extracted Token:</strong> {{ token() }}
        </p>
      }

      @if (isSuccess()) {
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; padding: 1rem; border-radius: 6px; text-align: center; margin-top: 1rem;">
          <strong>Password successfully adjusted!</strong><br>Routing context moving back to signature screen...
        </div>
      } @else {
        <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" style="display: flex; flex-direction: column; gap: 15px; margin-top: 1.5rem;">
          <div>
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">New Password Structure</label>
            <input type="password" formControlName="password" style="width: 100%; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 4px;">
          </div>
          <button type="submit" [disabled]="resetForm.invalid || !token()" style="background: #2563eb; color: white; border: none; padding: 0.75rem; border-radius: 4px; cursor: pointer; font-weight: bold;">
            Save Adjusted Password
          </button>
        </form>
      }
    </div>
  `
})
export class ResetPasswordComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  protected token = signal<string | null>(null);
  protected isSuccess = signal(false);

  protected resetForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit(): void {
    this.route.queryParamMap.pipe(take(1)).subscribe(params => {
      this.token.set(params.get('token'));
      if (!this.token()) {
        this.resetForm.disable();
      }
    });
  }

  onSubmit() {
    if (this.resetForm.invalid || !this.token()) return;
    this.isSuccess.set(true);
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }
}
