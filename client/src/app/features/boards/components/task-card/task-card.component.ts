import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../../core/models/task.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="bg-surface/50 p-3 rounded-lg shadow-sm border border-border-base cursor-move hover:shadow-md transition-all group relative flex flex-col gap-2"
      [class.border-l-4]="task.urgent && !task.completed"
      [class.border-l-red-500]="task.urgent && !task.completed"
      [class.opacity-60]="task.completed"
      [class.hover:opacity-100]="task.completed"
    >
      @if (task.urgent && !task.completed) {
        <span
          class="absolute top-2 right-2 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide z-10"
        >
          Urgent
        </span>
      }

      <div class="pr-12">
        <h4
          class="font-semibold text-txt-main text-sm leading-tight break-words"
          [class.line-through]="task.completed"
          [class.decoration-gray-400]="task.completed"
          [class.text-txt-muted]="task.completed"
        >
          <span class="mr-1.5">{{ task.icon || '📑' }}</span
          >{{ task.title }}
        </h4>
      </div>

      @if (task.description) {
        <p
          class="text-xs text-txt-main line-clamp-3 break-words whitespace-pre-wrap"
          [class.line-through]="task.completed"
        >
          {{ task.description }}
        </p>
      }

      <div
        class="mt-2 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100"
      >
        <button
          (click)="onEdit($event)"
          class="p-1.5 text-txt-main hover:text-txt-main hover:bg-border-base/25 rounded transition"
          title="Edit Task"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          </svg>
        </button>

        <button
          (click)="onDelete($event)"
          class="p-1.5 text-txt-main hover:text-red-600 hover:bg-red-500/10 rounded transition"
          title="Delete Task"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  `,
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;

  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<number>();

  onEdit(event: Event) {
    event.stopPropagation();
    this.edit.emit(this.task);
  }

  onDelete(event: Event) {
    event.stopPropagation();
    this.delete.emit(this.task.id);
  }
}
