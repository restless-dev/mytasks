import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

export interface SimpleInputData {
  title: string;
  label: string;
  placeholder?: string;
  initialValue?: string;
  initialIcon?: string;
  maxLength?: number;
}

export interface SimpleInputResult {
  text: string;
  icon: string;
}

@Component({
  selector: 'app-simple-input-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PickerComponent],
  template: `
    <div class="fixed inset-0 bg-black/60 z-[100]" (click)="close()"></div>

    <div class="fixed inset-0 flex items-center justify-center p-4 z-[101]">
      <div
        class="relative w-full max-w-md bg-surface border border-border-base rounded-lg shadow-xl p-6 overflow-visible"
      >
        <h2 class="text-xl font-bold mb-4 text-txt-main">{{ data.title }}</h2>

        <form [formGroup]="form" (ngSubmit)="save()">
          <div>
            <label class="block text-sm font-medium text-txt-main mb-1">{{ data.label }}</label>

            <div class="flex gap-2">
              <div class="relative">
                <button
                  type="button"
                  (click)="toggleEmojiPicker()"
                  class="w-10 h-10 flex items-center justify-center border border-border-base bg-transparent text-txt-main rounded-md hover:bg-surface-hover focus:ring-2 focus:ring-brand focus:outline-none text-xl transition-colors"
                >
                  {{ currentIcon() }}
                </button>

                @if (showEmojiPicker()) {
                  <div class="absolute top-12 left-0 z-50 shadow-xl">
                    <div class="fixed inset-0 z-40" (click)="toggleEmojiPicker()"></div>
                    <div class="relative z-50">
                      <emoji-mart
                        [showPreview]="false"
                        [enableSearch]="true"
                        (emojiSelect)="selectEmoji($event)"
                      ></emoji-mart>
                    </div>
                  </div>
                }
              </div>

              <input
                formControlName="value"
                [placeholder]="data.placeholder || ''"
                class="flex-1 border border-border-base bg-transparent text-txt-main rounded-md p-2 focus:ring-2 focus:ring-brand focus:border-brand focus:outline-none"
                autofocus
              />
            </div>

            <div class="flex justify-between mt-1 h-4">
              <span class="text-xs text-red-500">
                @if (form.get('value')?.hasError('required') && form.get('value')?.touched) {
                  Required
                }
                @if (form.get('value')?.hasError('maxlength')) {
                  Too long
                }
              </span>
              @if (data.maxLength) {
                <span class="text-xs text-txt-muted">
                  {{ form.get('value')?.value?.length || 0 }}/{{ data.maxLength }}
                </span>
              }
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button
              type="button"
              (click)="close()"
              class="text-txt-inv font-medium px-4 py-2 hover:bg-surface-hover hover:text-txt-main rounded transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="form.invalid"
              class="bg-brand text-brand-text font-medium px-4 py-2 rounded hover:bg-brand-hover transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class SimpleInputModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  public dialogRef = inject(DialogRef<SimpleInputResult>);
  public data: SimpleInputData = inject(DIALOG_DATA);

  currentIcon = signal('📋');
  showEmojiPicker = signal(false);

  form = this.fb.nonNullable.group({
    value: ['', [Validators.required]],
  });

  ngOnInit() {
    if (this.data.maxLength) {
      this.form.controls.value.addValidators(Validators.maxLength(this.data.maxLength));
    }
    if (this.data.initialValue) {
      this.form.patchValue({ value: this.data.initialValue });
    }
    if (this.data.initialIcon) {
      this.currentIcon.set(this.data.initialIcon);
    }
  }

  toggleEmojiPicker() {
    this.showEmojiPicker.update((v) => !v);
  }

  selectEmoji(event: any) {
    this.currentIcon.set(event.emoji.native);
    this.showEmojiPicker.set(false);
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close({
        text: this.form.getRawValue().value,
        icon: this.currentIcon(),
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
