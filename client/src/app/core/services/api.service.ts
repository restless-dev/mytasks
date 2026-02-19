import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Board } from '../models/board.model';
import { Column } from '../models/column.model';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  signup(data: any) {
    return this.http.post(`${this.apiUrl}/auth/signup`, data);
  }
  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, data);
  }

  updateUser(
    id: number,
    data: { username?: string; password?: string; currentPassword?: string },
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}`, data);
  }

  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(`${this.apiUrl}/boards`);
  }

  createBoard(icon: string, title: string): Observable<Board> {
    return this.http.post<Board>(`${this.apiUrl}/boards`, { icon, title });
  }

  updateBoard(id: number, icon?: string, title?: string): Observable<Board> {
    return this.http.put<Board>(`${this.apiUrl}/boards/${id}`, { icon, title });
  }

  deleteBoard(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/boards/${id}`);
  }

  createColumn(boardId: number, icon: string, title: string): Observable<Column> {
    return this.http.post<Column>(`${this.apiUrl}/columns`, { boardId, icon, title });
  }

  updateColumn(id: number, icon?: string, title?: string): Observable<Column> {
    return this.http.put<Column>(`${this.apiUrl}/columns/${id}`, { icon, title });
  }

  deleteColumn(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/columns/${id}`);
  }

  createTask(data: {
    columnId: number;
    description?: string;
    title: string;
    icon?: string;
    urgent?: boolean;
  }): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/tasks`, data);
  }

  updateTask(id: number, changes: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${id}`, changes);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tasks/${id}`);
  }
}
