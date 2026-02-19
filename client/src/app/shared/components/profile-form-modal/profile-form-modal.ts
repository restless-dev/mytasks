import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  selector: 'app-profile-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 bg-black/60 z-[100]" (click)="close()"></div>

    <div class="fixed inset-0 flex items-center justify-center p-4 z-[101]">
      <div
        class="relative w-full max-w-md bg-surface border border-border-base rounded-lg shadow-xl p-6"
      >
        <h2 class="text-2xl font-bold mb-6 text-txt-main">Edit Profile</h2>

        <form [formGroup]="profileForm" (ngSubmit)="save()">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-txt-main mb-1">Email</label>
              <input
                formControlName="email"
                class="mt-1 w-full border border-border-base bg-app-bg/25 text-txt-main/50 rounded-md p-2 cursor-not-allowed"
              />
              <p class="text-xs text-txt-main mt-1">Email cannot be changed.</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-txt-main mb-1">Username</label>
              <input
                formControlName="username"
                class="mt-1 w-full border border-border-base bg-transparent text-txt-main rounded-md p-2 focus:ring-2 focus:ring-brand focus:border-brand focus:outline-none"
              />
              @if (profileForm.get('username')?.hasError('required')) {
                <p class="text-red-500 text-xs mt-1">Username is required.</p>
              }
              @if (profileForm.get('username')?.hasError('maxlength')) {
                <p class="text-red-500 text-xs mt-1">Max 20 characters.</p>
              }
              @if (profileForm.get('username')?.hasError('pattern')) {
                <p class="text-red-500 text-xs mt-1">
                  Only letters, numbers, and underscores are allowed.
                </p>
              }
            </div>
          </div>

          <div class="mt-8 flex justify-end gap-4">
            <button
              type="button"
              (click)="close()"
              class="text-txt-main font-medium px-4 py-2 rounded-md hover:bg-surface-hover hover:text-txt-main transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="profileForm.invalid || profileForm.pristine"
              class="bg-brand text-brand-text font-medium px-4 py-2 rounded-md hover:bg-brand-hover transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class ProfileFormModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  public dialogRef = inject(DialogRef);
  public data: { user: any } = inject(DIALOG_DATA);

  profileForm = this.fb.nonNullable.group({
    email: [{ value: '', disabled: true }],
    username: [
      '',
      [Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z0-9_]*$/)],
    ],
  });

  ngOnInit() {
    if (this.data.user) {
      this.profileForm.patchValue({
        email: this.data.user.email,
        username: this.data.user.username,
      });
    }
  }

  save() {
    if (this.profileForm.valid) {
      this.dialogRef.close({ username: this.profileForm.getRawValue().username });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
