import { AppError } from '../utils/AppError.js';
import {
  createTask as createTaskRepository,
  deleteTask as deleteTaskRepository,
  getTasks as getTasksRepository,
  updateTask as updateTaskRepository,
} from '../repositories/task.repository.js';

export type TaskPayload = {
  columnId: number;
  completed: boolean;
  description: string | null;
  icon: string;
  id: number;
  title: string;
  urgent: boolean;
};

export const getTasks = async (userId: number): Promise<TaskPayload[]> => {
  const tasks = await getTasksRepository(userId);

  return tasks;
};

export const createTask = async (
  columnId: number,
  description: string,
  title: string,
  urgent?: boolean,
  icon?: string,
): Promise<TaskPayload> => {
  const task = await createTaskRepository(
    columnId,
    description,
    title,
    urgent,
    icon,
  );

  return task;
};

export const updateTask = async (
  id: number,
  columnId?: number,
  completed?: boolean,
  description?: string,
  title?: string,
  urgent?: boolean,
  icon?: string,
): Promise<TaskPayload> => {
  const updatedTask = await updateTaskRepository(
    id,
    columnId,
    completed,
    description,
    title,
    urgent,
    icon,
  );

  if (!updatedTask) throw new AppError('Task not found.', 404);

  return updatedTask;
};

export const deleteTask = async (id: number): Promise<void> => {
  await deleteTaskRepository(id);
};
