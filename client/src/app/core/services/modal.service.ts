import { Dialog } from '@angular/cdk/dialog';
import { Injectable, inject } from '@angular/core';
import { Observable, filter } from 'rxjs';
import { ProfileFormModalComponent } from '../../shared/components/profile-form-modal/profile-form-modal';
import {
  SimpleInputModalComponent,
  SimpleInputData,
  SimpleInputResult,
} from '../../shared/components/simple-input-modal/simple-input-modal.component';
import { Task } from '../models/task.model';
import { TaskFormModalComponent } from '../../shared/components/task-form-modal/task-form-modal';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private dialog = inject(Dialog);

  openProfileForm(user: any): Observable<any> {
    const dialogRef = this.dialog.open(ProfileFormModalComponent, {
      width: '400px',
      data: { user },
    });

    return dialogRef.closed.pipe(filter((result) => !!result));
  }

  openSimpleInput(config: SimpleInputData): Observable<SimpleInputResult> {
    const dialogRef = this.dialog.open<SimpleInputResult>(SimpleInputModalComponent, {
      width: '400px',
      data: config,
    });

    return dialogRef.closed.pipe(filter((result): result is SimpleInputResult => !!result));
  }

  openTaskForm(task?: Task): Observable<Partial<Task>> {
    const dialogRef = this.dialog.open<Partial<Task>>(TaskFormModalComponent, {
      width: '500px',
      data: { task },
    });

    return dialogRef.closed.pipe(filter((result): result is Partial<Task> => !!result));
  }

  confirm(title: string, message: string, confirmText = 'Delete'): Observable<boolean> {
    const dialogRef = this.dialog.open<boolean>(ConfirmModalComponent, {
      width: '400px',
      data: { title, message, confirmText },
    });

    return dialogRef.closed.pipe(filter((result): result is boolean => result === true));
  }
}
