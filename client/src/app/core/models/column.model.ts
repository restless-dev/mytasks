import { Task } from './task.model';

export interface Column {
  boardId: number;
  icon?: string;
  id: number;
  tasks: Task[];
  title: string;
}
