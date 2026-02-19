import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-app-bg relative overflow-hidden">
      <div class="bg-doodle"></div>

      <div
        class="relative z-10 w-full max-w-md bg-surface p-8 rounded-xl shadow-xl border border-border-base"
      >
        <h2 class="text-3xl font-bold mb-8 text-center text-txt-main">Create Account</h2>

        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <div>
            <label class="block text-sm font-bold text-txt-main mb-1">Username</label>
            <input
              type="text"
              formControlName="username"
              class="w-full rounded-md border border-border-base bg-transparent text-txt-main p-2.5 focus:ring-2 focus:ring-brand focus:border-brand focus:outline-none transition-shadow placeholder-txt-inv"
              placeholder="johndoe"
            />
            @if (signupForm.get('username')?.touched && signupForm.get('username')?.invalid) {
              @if (signupForm.get('username')?.hasError('required')) {
                <p class="text-red-500 text-xs mt-1 font-medium">Username is required.</p>
              } @else if (signupForm.get('username')?.hasError('maxlength')) {
                <p class="text-red-500 text-xs mt-1 font-medium">
                  Username cannot exceed 20 characters.
                </p>
              } @else if (signupForm.get('username')?.hasError('pattern')) {
                <p class="text-red-500 text-xs mt-1 font-medium">
                  Only letters, numbers, and underscores are allowed.
                </p>
              }
            }
          </div>

          <div>
            <label class="block text-sm font-bold text-txt-main mb-1">Email</label>
            <input
              type="email"
              formControlName="email"
              class="w-full rounded-md border border-border-base bg-transparent text-txt-main p-2.5 focus:ring-2 focus:ring-brand focus:border-brand focus:outline-none transition-shadow placeholder-txt-inv"
              placeholder="john@example.com"
            />
            @if (signupForm.get('email')?.touched && signupForm.get('email')?.invalid) {
              <p class="text-red-500 text-xs mt-1 font-medium">Please enter a valid email.</p>
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
            @if (signupForm.get('password')?.touched && signupForm.get('password')?.invalid) {
              <p class="text-red-500 text-xs mt-1 font-medium">
                Password must be at least 6 characters.
              </p>
            }
          </div>

          <button
            type="submit"
            [disabled]="signupForm.invalid || isLoading"
            class="w-full bg-brand text-brand-text font-bold py-2.5 px-4 rounded-md hover:bg-brand-hover transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {{ isLoading ? 'Creating Account...' : 'Sign Up' }}
          </button>

          <div class="text-center mt-6 text-sm">
            <span class="text-txt-inv">Already have an account? </span>
            <a
              routerLink="/login"
              class="text-brand hover:text-brand-hover hover:underline cursor-pointer font-bold"
              >Sign In</a
            >
          </div>
        </form>
      </div>
    </div>
  `,
})
export class SignupComponent {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private toast = inject(ToastService);

  isLoading = false;

  signupForm = this.fb.group({
    username: [
      '',
      [Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z0-9_]*$/)],
    ],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.api.signup(this.signupForm.value).subscribe({
        next: () => {
          this.toast.success('Account created! Please log in.');
          this.router.navigate(['/login']);
        },
        error: (err: any) => {
          this.isLoading = false;
          this.toast.error(err.error.message || 'Signup failed');
        },
      });
    }
  }
}
