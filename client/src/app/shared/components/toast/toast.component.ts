import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ToastType = 'success' | 'error' | 'info';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  styles: [
    `
      /* 1. Define the Keyframes */
      @keyframes slideIn {
        from {
          transform: translateY(100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      @keyframes slideOut {
        from {
          transform: translateY(0);
          opacity: 1;
        }
        to {
          transform: translateY(100%);
          opacity: 0;
        }
      }

      /* 2. Apply Entry Animation automatically on load */
      .toast-enter {
        animation: slideIn 300ms cubic-bezier(0.35, 0, 0.25, 1) forwards;
      }

      /* 3. Apply Exit Animation when class is added */
      .toast-exit {
        animation: slideOut 300ms cubic-bezier(0.35, 0, 0.25, 1) forwards;
      }
    `,
  ],
  template: `
    <div
      class="toast-enter flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border min-w-[300px] max-w-md pointer-events-auto"
      [class.toast-exit]="isClosing"
      [ngClass]="{
        'bg-white border-green-500 text-gray-800': type === 'success',
        'bg-white border-red-500 text-gray-800': type === 'error',
        'bg-white border-blue-500 text-gray-800': type === 'info',
      }"
    >
      <!-- Icon (Success) -->
      @if (type === 'success') {
        <div
          class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      }
      <!-- Icon (Error) -->
      @else if (type === 'error') {
        <div
          class="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      }
      <!-- Icon (Info) -->
      @else {
        <div
          class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      }

      <div class="flex-1">
        <p class="font-medium text-sm">{{ message }}</p>
      </div>

      <button (click)="triggerClose()" class="text-gray-400 hover:text-gray-600 transition">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  `,
})
export class ToastComponent {
  @Input() message: string = '';
  @Input() type: ToastType = 'info';
  @Input() close!: () => void; // The "Real" close function from service

  isClosing = false;

  triggerClose() {
    this.isClosing = true; // 1. Start exit animation
    setTimeout(() => {
      this.close(); // 2. Actually destroy component after 300ms
    }, 300);
  }
}
