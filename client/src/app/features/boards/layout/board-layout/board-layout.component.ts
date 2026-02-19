import { Component, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { BoardStateService } from '../../../../core/services/board-state.service';
import { ApiService } from '../../../../core/services/api.service';
import { ModalService } from '../../../../core/services/modal.service';
import { ThemeToggleComponent } from '../../../../shared/components/theme-toggle/theme-toggle.component';
import { Board } from '../../../../core/models/board.model';

@Component({
  selector: 'app-board-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ThemeToggleComponent],
  template: `
    <div class="flex h-screen bg-app-bg overflow-hidden text-txt-main">
      <aside
        class="w-64 bg-sidebar text-txt-muted flex flex-col flex-shrink-0 transition-all duration-300 border-r border-border-base"
      >
        <div class="p-6 border-b border-border-base flex items-center gap-2">
          <div
            class="w-8 h-8 bg-brand rounded-lg flex items-center justify-center font-bold text-txt-muted shadow-lg shadow-brand/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
              <path
                fill="#f9e2af"
                d="M197.8 100.3C208.7 107.9 211.3 122.9 203.7 133.7L147.7 213.7C143.6 219.5 137.2 223.2 130.1 223.8C123 224.4 116 222 111 217L71 177C61.7 167.6 61.7 152.4 71 143C80.3 133.6 95.6 133.7 105 143L124.8 162.8L164.4 106.2C172 95.3 187 92.7 197.8 100.3zM197.8 260.3C208.7 267.9 211.3 282.9 203.7 293.7L147.7 373.7C143.6 379.5 137.2 383.2 130.1 383.8C123 384.4 116 382 111 377L71 337C61.6 327.6 61.6 312.4 71 303.1C80.4 293.8 95.6 293.7 104.9 303.1L124.7 322.9L164.3 266.3C171.9 255.4 186.9 252.8 197.7 260.4zM288 160C288 142.3 302.3 128 320 128L544 128C561.7 128 576 142.3 576 160C576 177.7 561.7 192 544 192L320 192C302.3 192 288 177.7 288 160zM288 320C288 302.3 302.3 288 320 288L544 288C561.7 288 576 302.3 576 320C576 337.7 561.7 352 544 352L320 352C302.3 352 288 337.7 288 320zM224 480C224 462.3 238.3 448 256 448L544 448C561.7 448 576 462.3 576 480C576 497.7 561.7 512 544 512L256 512C238.3 512 224 497.7 224 480zM128 440C150.1 440 168 457.9 168 480C168 502.1 150.1 520 128 520C105.9 520 88 502.1 88 480C88 457.9 105.9 440 128 440z"
              />
            </svg>
          </div>
          <span class="font-bold text-xl tracking-tight text-txt-muted">MyTasks</span>
        </div>

        <div class="flex-1 overflow-y-auto py-4 space-y-1 ">
          <h3 class="px-6 text-xs font-semibold text-txt-muted uppercase tracking-wider mb-2 ">
            My Boards
          </h3>

          @for (board of boardState.boards(); track board.id) {
            <div
              class="group relative flex items-center justify-between px-6 py-3 text-sm font-medium transition cursor-pointer border-r-4 "
              [ngClass]="{
                'bg-white/10 text-txt-muted border-brand':
                  boardState.activeBoard()?.id === board.id,
                'text-txt-muted border-transparent hover:bg-white/5 hover:text-txt-muted-200':
                  boardState.activeBoard()?.id !== board.id,
              }"
              (click)="selectBoard(board.id)"
            >
              <div class="flex items-center overflow-hidden w-full ">
                <span class="text-xl mr-3 leading-none flex-shrink-0 ">{{
                  board.icon || '🗃️'
                }}</span>
                <span class="truncate pr-6">{{ board.title }}</span>
              </div>

              <div
                class="hidden group-hover:flex items-center gap-1 absolute right-2 top-1/2 -translate-y-1/2 pl-2 z-10"
              >
                <button
                  (click)="$event.stopPropagation(); updateBoard(board)"
                  class="p-1.5 hover:bg-white/20 rounded text-txt-muted hover:text-txt-muted transition"
                  title="Update Board"
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
                  (click)="$event.stopPropagation(); deleteBoard(board.id)"
                  class="p-1.5 hover:bg-red-900/50 rounded text-txt-muted hover:text-red-400 transition"
                  title="Delete Board"
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
          }
        </div>

        <div class="p-4 border-t border-border-base space-y-3">
          <button
            (click)="createBoard()"
            class="w-full flex items-center justify-center gap-2 bg-brand hover:bg-brand-hover text-txt-muted py-2 rounded-md transition text-sm font-medium shadow-lg shadow-brand/20"
          >
            + New Board
          </button>

          <div class="flex items-center justify-between pt-1">
            <app-theme-toggle></app-theme-toggle>

            <a
              href="https://github.com/restless-dev/mytasks"
              target="_blank"
              class="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-md text-sm font-bold transition shadow-sm no-underline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                />
              </svg>
              Get the code
            </a>
          </div>
        </div>
      </aside>

      <main class="flex-1 overflow-hidden relative">
        <div class="bg-doodle"></div>

        <div class="relative z-10 h-full w-full">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
})
export class BoardLayoutComponent implements OnInit {
  boardState = inject(BoardStateService);
  modalService = inject(ModalService);
  api = inject(ApiService);
  router = inject(Router);

  constructor() {
    effect(() => {
      const boards = this.boardState.boards();
      if (boards.length > 0 && this.router.url === '/boards') {
        this.selectBoard(boards[0].id);
      }
    });
  }

  ngOnInit() {
    this.boardState.loadBoards();
  }

  selectBoard(id: number) {
    this.boardState.selectBoard(id);
    this.router.navigate(['/boards', id]);
  }

  createBoard() {
    this.modalService
      .openSimpleInput({
        title: 'New Board',
        label: 'Board Title',
        placeholder: 'My Awesome Project',
        maxLength: 30,
        initialIcon: '🗃️',
      })
      .subscribe((result) => {
        this.boardState.createBoard(result.icon, result.text);
      });
  }

  updateBoard(board: Board) {
    this.modalService
      .openSimpleInput({
        title: 'Update Board',
        label: 'Board Title',
        initialValue: board.title,
        initialIcon: board.icon,
        maxLength: 30,
      })
      .subscribe((result) => {
        this.boardState.updateBoard(board.id, result.icon, result.text);
      });
  }

  deleteBoard(id: number) {
    this.modalService
      .confirm(
        'Delete Board?',
        'Are you sure you want to delete this board? All content will be lost.',
      )
      .subscribe(() => {
        this.boardState.deleteBoard(id);
      });
  }
}
