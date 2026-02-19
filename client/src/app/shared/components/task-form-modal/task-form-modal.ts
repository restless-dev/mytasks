import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { Task } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PickerComponent],
  template: `
    <div class="fixed inset-0 bg-black/60 z-[100]" (click)="close()"></div>

    <div class="fixed inset-0 flex items-center justify-center p-4 z-[101]">
      <div
        class="relative w-full max-w-lg bg-surface border border-border-base rounded-lg shadow-xl p-6 overflow-visible"
      >
        <h2 class="text-2xl font-bold mb-6 text-txt-main">
          {{ isEditMode ? 'Edit Task' : 'Create New Task' }}
        </h2>

        <form [formGroup]="taskForm" (ngSubmit)="save()">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-txt-main">Title</label>
              <div class="flex gap-2 mt-1">
                <div class="relative">
                  <button
                    type="button"
                    (click)="toggleEmojiPicker()"
                    class="w-10 h-10 border border-border-base bg-transparent text-txt-main rounded-md hover:bg-surface-hover flex items-center justify-center text-xl transition-colors"
                  >
                    {{ currentIcon() }}
                  </button>
                  @if (showEmojiPicker()) {
                    <div class="absolute top-12 left-0 z-50 shadow-xl">
                      <div class="fixed inset-0 z-40" (click)="toggleEmojiPicker()"></div>
                      <div class="relative z-50">
                        <emoji-mart
                          [showPreview]="false"
                          (emojiSelect)="selectEmoji($event)"
                        ></emoji-mart>
                      </div>
                    </div>
                  }
                </div>

                <input
                  formControlName="title"
                  class="flex-1 border border-border-base bg-transparent text-txt-main rounded-md p-2 w-full focus:ring-2 focus:ring-brand focus:border-brand focus:outline-none placeholder-txt-muted"
                />
              </div>
              <div class="flex justify-end mt-1">
                <span
                  class="text-xs text-txt-inv"
                  [class.text-red-500]="taskForm.get('title')?.hasError('maxlength')"
                >
                  {{ taskForm.get('title')?.value?.length || 0 }}/50
                </span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-txt-main">Description</label>
              <textarea
                formControlName="description"
                rows="4"
                class="mt-1 w-full border border-border-base bg-transparent text-txt-main rounded-md p-2 resize-none focus:ring-2 focus:ring-brand focus:border-brand focus:outline-none placeholder-txt-muted"
              ></textarea>
              <div class="flex justify-end mt-1">
                <span
                  class="text-xs text-txt-muted"
                  [class.text-red-500]="taskForm.get('description')?.hasError('maxlength')"
                >
                  {{ taskForm.get('description')?.value?.length || 0 }}/500
                </span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              formControlName="urgent"
              id="urgentCheck"
              class="w-4 h-4 text-brand rounded border-border-base bg-transparent focus:ring-brand focus:ring-offset-surface cursor-pointer"
            />
            <label
              for="urgentCheck"
              class="text-sm font-medium text-txt-main cursor-pointer select-none"
            >
              Mark as Urgent
            </label>
          </div>

          <div class="mt-8 flex justify-end gap-4">
            <button
              type="button"
              (click)="close()"
              class="text-txt-inv font-medium px-4 py-2 rounded-md hover:bg-surface-hover hover:text-txt-main transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="taskForm.invalid"
              class="bg-brand text-brand-text font-medium px-4 py-2 rounded-md hover:bg-brand-hover transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isEditMode ? 'Save Changes' : 'Create Task' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class TaskFormModalComponent implements OnInit {
  private fb = inject(FormBuilder);

  public dialogRef = inject(DialogRef<Partial<Task>>);
  public data: { task?: Task } = inject(DIALOG_DATA);

  currentIcon = signal('📑');
  showEmojiPicker = signal(false);
  isEditMode = !!this.data.task;

  taskForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.maxLength(500)]],
    urgent: [false],
  });

  ngOnInit() {
    if (this.isEditMode && this.data.task) {
      this.taskForm.patchValue(this.data.task);
      if (this.data.task.icon) {
        this.currentIcon.set(this.data.task.icon);
      }
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
    if (this.taskForm.valid) {
      const formValue = this.taskForm.getRawValue();
      this.dialogRef.close({
        ...formValue,
        icon: this.currentIcon(),
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
