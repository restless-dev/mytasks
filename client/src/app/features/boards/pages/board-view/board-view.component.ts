import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ApiService } from '../../../../core/services/api.service';
import { Board } from '../../../../core/models/board.model';
import { BoardStateService } from '../../../../core/services/board-state.service';
import { Column } from '../../../../core/models/column.model';
import { ModalService } from '../../../../core/services/modal.service';
import { Task } from '../../../../core/models/task.model';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-board-view',
  standalone: true,
  imports: [CommonModule, DragDropModule, TaskCardComponent],
  template: `
    <div class="h-full flex flex-col">
      <header
        class="bg-surface-hover border-b border-border-base h-16 flex items-center px-6 justify-between flex-shrink-0"
      >
        @if (boardState.activeBoard(); as board) {
          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-bold text-txt-main flex items-center gap-2 mr-2">
              <span class="text-3xl">{{ board.icon || '🗃️' }}</span>
              {{ board.title }}
            </h1>

            <button
              (click)="updateBoard(board)"
              class="text-txt-main hover:text-txt-main p-1.5 hover:bg-border-base/25 rounded-md transition"
              title="Update Board"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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
              (click)="deleteBoard(board.id)"
              class="text-txt-main hover:text-red-600 p-1.5 hover:bg-red-500/10 rounded-md transition"
              title="Delete Board"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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

          <div class="flex items-center gap-4">
            <button
              (click)="logout()"
              class="p-2 text-txt-main hover:text-red-600 hover:bg-red-500/10 rounded-lg transition"
              title="Logout"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" x2="9" y1="12" y2="12" />
              </svg>
            </button>

            @if (currentUser) {
              <button
                (click)="openProfileModal()"
                class="flex items-center gap-2 text-sm font-medium text-txt-main hover:text-brand bg-surface-hover hover:bg-border-base/25 px-3 py-2 rounded-lg transition shadow-sm border border-border-base"
                title="Edit Profile"
              >
                <div
                  class="w-6 h-6 bg-sidebar text-white rounded-full flex items-center justify-center text-xs font-bold"
                >
                  {{ currentUser.username.charAt(0).toUpperCase() }}
                </div>
                <span>{{ currentUser.username }}</span>
              </button>
            }
          </div>
        } @else {
          <div class="animate-pulse h-6 w-32 bg-surface-hover rounded"></div>
        }
      </header>

      <div class="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <div class="flex h-full gap-6 items-start" cdkDropListGroup>
          @for (col of boardState.activeBoardColumns(); track col.id) {
            <div
              class="group/column w-80 flex-shrink-0 flex flex-col max-h-full bg-surface-hover rounded-xl shadow-sm border border-border-base"
            >
              <div class="p-3 font-bold text-txt-main flex justify-between items-center group">
                <div class="flex items-center gap-2 overflow-hidden">
                  <span class="text-xl flex-shrink-0">{{ col.icon || '📂' }}</span>
                  <span class="truncate">{{ col.title }}</span>
                  <span
                    class="text-txt-main bg-black/5 dark:bg-white/10 text-xs font-normal bg-surface-hover px-2 py-0.5 rounded-full flex-shrink-0"
                  >
                    {{ col.tasks.length }}
                  </span>
                </div>

                <div
                  class="flex items-center gap-1 opacity-0 group-hover/column:opacity-100 transition-opacity"
                >
                  <button
                    (click)="updateColumn(col)"
                    class="p-1.5 text-txt-main hover:text-txt-main hover:bg-border-base/25 rounded transition"
                    title="Rename Section"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
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
                    (click)="deleteColumn(col.id)"
                    class="p-1.5 text-txt-main hover:text-red-600 hover:bg-red-500/10 rounded transition"
                    title="Delete Section"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
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

              <div
                cdkDropList
                [id]="'col-' + col.id"
                [cdkDropListData]="col.tasks"
                (cdkDropListDropped)="drop($event, col.id, false)"
                class="p-2 flex-1 overflow-y-auto space-y-2 min-h-[100px]"
              >
                @for (task of col.tasks; track task.id) {
                  <app-task-card
                    cdkDrag
                    [cdkDragData]="task"
                    [task]="task"
                    (edit)="handleEditTask($event)"
                    (delete)="handleDeleteTask($event)"
                    class="block mb-2"
                  >
                    <div
                      *cdkDragPlaceholder
                      class="bg-surface-hover border border-dashed border-gray-300 rounded-lg h-20 w-full"
                    ></div>
                  </app-task-card>
                }
              </div>

              <button
                (click)="createTask(col.id)"
                class="m-2 py-2.5 text-sm text-txt-main font-medium hover:text-txt-main hover:bg-border-base/40 hover:shadow-sm rounded-lg transition-all duration-200 active:scale-95 text-left px-3 flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Create Task
              </button>
            </div>
          }

          <div
            class="w-80 flex-shrink-0 flex flex-col max-h-full bg-surface-hover/50 rounded-xl border border-gray-300 border-dashed"
          >
            <div class="p-3 font-bold text-txt-main flex justify-between">
              Done
              <span class="text-txt-main bg-black/5 dark:bg-white/10 text-xs">{{
                boardState.doneTasks().length
              }}</span>
            </div>

            <div
              cdkDropList
              id="done-column"
              [cdkDropListData]="boardState.doneTasks()"
              (cdkDropListDropped)="drop($event, 0, true)"
              class="p-2 flex-1 overflow-y-auto space-y-2 min-h-[100px]"
            >
              @for (task of boardState.doneTasks(); track task.id) {
                <app-task-card
                  cdkDrag
                  [cdkDragData]="task"
                  [task]="task"
                  (edit)="handleEditTask($event)"
                  (delete)="handleDeleteTask($event)"
                  class="block mb-2"
                >
                  <div
                    *cdkDragPlaceholder
                    class="bg-surface-hover border border-dashed border-gray-300 rounded-lg h-20 w-full"
                  ></div>
                </app-task-card>
              }
            </div>
          </div>

          <button
            (click)="createColumn()"
            class="w-80 flex-shrink-0 h-12 rounded-xl bg-surface-hover/50 hover:bg-surface-hover border border-transparent hover:border-brand text-brand font-medium flex items-center justify-center transition shadow-sm"
          >
            Create a new column
          </button>
        </div>
      </div>
    </div>
  `,
})
export class BoardViewComponent implements OnInit {
  api = inject(ApiService);
  boardState = inject(BoardStateService);
  modalService = inject(ModalService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  toast = inject(ToastService);

  currentUser: any = null;

  connectedLists = computed(() => {
    const realIds = this.boardState.activeBoardColumns().map((c) => 'col-' + c.id);
    return [...realIds, 'done-column'];
  });

  ngOnInit() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
    }

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.boardState.selectBoard(Number(id));
      }
    });
  }

  openProfileModal() {
    if (!this.currentUser) return;

    this.modalService.openProfileForm(this.currentUser).subscribe((result) => {
      if (result && result.username) {
        this.api.updateUser(this.currentUser.id, { username: result.username }).subscribe({
          next: (updatedUser: any) => {
            this.currentUser.username = updatedUser.username;
            localStorage.setItem('user', JSON.stringify(this.currentUser));

            this.toast.success('Profile updated successfully');
          },
          error: (err) => {
            this.toast.error(err.error.message || 'Failed to update profile');
          },
        });
      }
    });
  }

  createColumn() {
    this.modalService
      .openSimpleInput({
        title: 'New Section',
        label: 'Section Name',
        maxLength: 20,
        initialIcon: '🗂️',
      })
      .subscribe((res) => {
        this.boardState.createColumn(res.icon, res.text);
      });
  }

  deleteColumn(id: number) {
    this.modalService
      .confirm('Delete Section?', 'Are you sure? All tasks in this section will be lost.')
      .subscribe(() => {
        this.boardState.deleteColumn(id);
      });
  }

  updateColumn(col: Column) {
    this.modalService
      .openSimpleInput({
        title: 'Rename Section',
        label: 'Section Name',
        initialValue: col.title,
        initialIcon: col.icon || '🗂️',
        maxLength: 20,
      })
      .subscribe((res) => {
        this.boardState.updateColumn(col.id, res.icon, res.text);
      });
  }

  deleteBoard(id: number) {
    this.modalService
      .confirm(
        'Delete Board?',
        'Are you sure you want to delete this board? This action cannot be undone.',
      )
      .subscribe(() => {
        this.boardState.deleteBoard(id);
      });
  }

  updateBoard(board: Board) {
    this.modalService
      .openSimpleInput({
        title: 'Update Board',
        label: 'Board Info',
        initialValue: board.title,
        initialIcon: board.icon || '🗃️',
        maxLength: 30,
      })
      .subscribe((res) => {
        this.boardState.updateBoard(board.id, res.icon, res.text);
      });
  }

  createTask(columnId: number) {
    this.modalService.openTaskForm().subscribe((res) => {
      if (res.title) {
        this.boardState.addTask(columnId, {
          title: res.title,
          description: res.description || '',
          urgent: res.urgent || false,
          icon: res.icon || '📑',
        });
      }
    });
  }

  handleDeleteTask(taskId: number) {
    this.modalService
      .confirm('Delete Task?', 'Are you sure you want to delete this task?')
      .subscribe(() => {
        this.boardState.deleteTask(taskId);
      });
  }

  handleEditTask(task: Task) {
    this.modalService.openTaskForm(task).subscribe((result) => {
      this.boardState.updateTask(task.id, {
        title: result.title,
        description: result.description,
        urgent: result.urgent,
      });
    });
  }

  drop(event: CdkDragDrop<Task[]>, targetColumnId: number, isTargetDone: boolean) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      const droppedTask = event.container.data[event.currentIndex];
      droppedTask.completed = isTargetDone;

      this.boardState.moveTask(task, isTargetDone ? null : targetColumnId, isTargetDone);
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
