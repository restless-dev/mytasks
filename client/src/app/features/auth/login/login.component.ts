import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-app-bg relative overflow-hidden">
      <div class="bg-doodle"></div>

      <div
        class="relative z-10 w-full max-w-md bg-surface p-8 rounded-xl shadow-xl border border-border-base"
      >
        <h2 class="text-3xl font-bold mb-8 text-center text-txt-main">Sign In</h2>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <div>
            <label class="block text-sm font-bold text-txt-main mb-1">Email</label>
            <input
              type="email"
              formControlName="email"
              class="w-full rounded-md border border-border-base bg-transparent text-txt-main p-2.5 focus:ring-2 focus:ring-brand focus:border-brand focus:outline-none transition-shadow placeholder-txt-inv"
              placeholder="john@example.com"
            />
            @if (loginForm.get('email')?.touched && loginForm.get('email')?.invalid) {
              <p class="text-red-500 text-xs mt-1 font-medium">
                Please enter a valid email address.
              </p>
            }
          </div>

          <div>
            <label class="block text-sm font-bold text-txt-main mb-1">Password</label>
            <input
              type="password"
              formControlName="password"
              class="w-full rounded-md border border-border-base bg-transparent text-txt-main p-2.5 focus:ring-2 focus:ring-brand focus:border-brand focus:outline-none transition-shadow placeholder-txt-inv"
              placeholder="••••••••"
            />
            @if (loginForm.get('password')?.touched && loginForm.get('password')?.invalid) {
              <p class="text-red-500 text-xs mt-1 font-medium">Password is required.</p>
            }
          </div>

          <button
            type="submit"
            [disabled]="loginForm.invalid || isLoading"
            class="w-full bg-brand text-brand-text font-bold py-2.5 px-4 rounded-md hover:bg-brand-hover transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {{ isLoading ? 'Signing In...' : 'Sign In' }}
          </button>

          <div class="text-center mt-6 text-sm">
            <span class="text-txt-inv">Don't have an account? </span>
            <a
              routerLink="/signup"
              class="text-brand hover:text-brand-hover hover:underline cursor-pointer font-bold"
            >
              Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private router = inject(Router);
  private toast = inject(ToastService);

  isLoading = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;

      this.api.login(this.loginForm.value).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.router.navigate(['/boards']);
        },
        error: (err) => {
          this.isLoading = false;
          this.toast.error(err.error.message || 'Login failed');
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
