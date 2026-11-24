import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/services/auth.service';
 
import { Router } from '@angular/router';
import { email, form, FormField, FormRoot, required, submit } from '@angular/forms/signals';

interface LoginModel {
  email: string;
  password: string;
}
 
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormField, FormRoot],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})

export class LoginComponent {
 
  private authService = inject(AuthService);
  private router = inject(Router);

  protected loading = signal(false);


  constructor() {
    console.log('CONVERT TO SIGNALS')
  }

  loginModel = signal({
    email: 'rlacey2@example.com',
    password: '',
  });

  // Must be a public class field (not private or inside ngOnInit)
  loginForm = form(this.loginModel, (schema) => {
    required(schema.email, { message: 'Email is required' });
    email(schema.email, { message: 'Enter a valid email address' });
    required(schema.password, { message: 'Password is required' });
  });

  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.loginForm, async () => {
      console.log('Submitting:', this.loginModel());
       await this.authService.login(this.loginModel());
    });
  }
}

 