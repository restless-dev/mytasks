import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { Board } from '../models/board.model';
import { Task } from '../models/task.model';
import { ToastService } from '../../core/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class BoardStateService {
  private api = inject(ApiService);
  private router = inject(Router);
  private toast = inject(ToastService);

  private boardsSignal = signal<Board[]>([]);

  private activeBoardIdSignal = signal<number | null>(null);

  readonly boards = this.boardsSignal.asReadonly();

  readonly activeBoard = computed(() => {
    const id = this.activeBoardIdSignal();
    return this.boardsSignal().find((b) => b.id === id) || null;
  });

  readonly activeBoardColumns = computed(() => {
    const board = this.activeBoard();
    if (!board) return [];

    return board.columns.map((col) => ({
      ...col,
      tasks: col.tasks.filter((t) => !t.completed),
    }));
  });

  readonly doneTasks = computed(() => {
    const board = this.activeBoard();
    if (!board) return [];

    return board.columns.flatMap((col) => col.tasks).filter((t) => t.completed);
  });

  loadBoards() {
    this.api.getBoards().subscribe((boards) => {
      this.boardsSignal.set(boards);

      if (!this.activeBoardIdSignal() && boards.length > 0) {
        this.selectBoard(boards[0].id);
      }
    });
  }

  createBoard(icon: string, title: string) {
    this.api.createBoard(icon, title).subscribe(() => this.loadBoards());
  }

  updateBoard(boardId: number, icon?: string, title?: string) {
    this.api.updateBoard(boardId, icon, title).subscribe(() => this.loadBoards());
  }

  deleteBoard(boardId: number) {
    if (this.boardsSignal().length <= 1) {
      this.toast.error('You cannot delete your last board.');
      return;
    }

    this.api.deleteBoard(boardId).subscribe({
      next: () => {
        const updatedBoards = this.boardsSignal().filter((b) => b.id !== boardId);
        this.boardsSignal.set(updatedBoards);
        this.toast.success('Board deleted successfully');

        if (updatedBoards.length > 0) {
          const nextBoard = updatedBoards[0];
          this.activeBoardIdSignal.set(nextBoard.id);
          this.router.navigate(['/boards', nextBoard.id]);
        } else {
          this.router.navigate(['/boards']);
        }
      },
    });
  }

  selectBoard(id: number) {
    this.activeBoardIdSignal.set(id);
  }

  createColumn(icon: string, title: string) {
    const boardId = this.activeBoardIdSignal();
    if (!boardId) return;

    this.api.createColumn(boardId, icon, title).subscribe(() => {
      this.loadBoards();
    });
  }

  updateColumn(columnId: number, icon?: string, text?: string) {
    this.api.updateColumn(columnId, icon, text).subscribe(() => this.loadBoards());
  }

  deleteColumn(columnId: number) {
    this.api.deleteColumn(columnId).subscribe({
      next: () => {
        this.loadBoards();
        this.toast.success('Section deleted');
      },
      error: () => this.toast.error('Failed to delete section'),
    });
  }

  addTask(
    columnId: number,
    taskData: { title: string; description: string; urgent: boolean; icon: string },
  ) {
    this.api.createTask({ ...taskData, columnId }).subscribe(() => {
      this.loadBoards();
    });
  }

  deleteTask(taskId: number) {
    this.api.deleteTask(taskId).subscribe({
      next: () => {
        this.loadBoards();
        this.toast.success('Task deleted');
      },
      error: () => this.toast.error('Failed to delete task'),
    });
  }

  moveTask(task: Task, targetColumnId: number | null, isTargetDone: boolean) {
    const updates: Partial<Task> = {
      completed: isTargetDone,
    };

    if (!isTargetDone && targetColumnId !== null) {
      updates.columnId = targetColumnId;
    }

    this.api.updateTask(task.id, updates).subscribe(() => {
      this.loadBoards();
    });
  }

  updateTask(taskId: number, updates: Partial<Task>) {
    this.api.updateTask(taskId, updates).subscribe(() => {
      this.loadBoards();
    });
  }
}
