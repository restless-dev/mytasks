import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
}

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-black/60 z-[100]" (click)="close(false)"></div>

    <div class="fixed inset-0 flex items-center justify-center p-4 z-[101]">
      <div
        class="bg-surface border border-border-base rounded-lg shadow-xl p-6 max-w-sm w-full animate-in fade-in zoom-in duration-200"
      >
        <h3 class="text-lg font-bold text-txt-main mb-2">
          {{ data.title }}
        </h3>

        <p class="text-txt-inv mb-6 text-sm leading-relaxed">
          {{ data.message }}
        </p>

        <div class="flex justify-end gap-3">
          <button
            (click)="close(false)"
            class="px-4 py-2 text-txt-inv hover:text-txt-main hover:bg-surface-hover rounded-md transition text-sm font-medium"
          >
            Cancel
          </button>

          <button
            (click)="close(true)"
            class="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md transition text-sm font-medium shadow-sm"
          >
            {{ data.confirmText || 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ConfirmModalComponent {
  public dialogRef = inject(DialogRef<boolean>);
  public data: ConfirmDialogData = inject(DIALOG_DATA);

  close(confirmed: boolean) {
    this.dialogRef.close(confirmed);
  }
}
