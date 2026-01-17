import { AppError } from '../utils/AppError.js';
import {
  createTask as createTaskRepository,
  deleteTask as deleteTaskRepository,
  getTasks as getTasksRepository,
  updateTask as updateTaskRepository,
} from '../repositories/task.repository.js';

export type TaskPayload = {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  urgent: boolean;
  columnId: number;
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
): Promise<TaskPayload> => {
  const task = await createTaskRepository(columnId, description, title, urgent);

  return task;
};

export const updateTask = async (
  id: number,
  completed?: boolean,
  description?: string,
  title?: string,
  urgent?: boolean,
): Promise<TaskPayload> => {
  const updatedTask = updateTaskRepository(
    id,
    completed,
    description,
    title,
    urgent,
  );

  if (!updatedTask) throw new AppError('Task not found.', 404);

  return updatedTask;
};

export const deleteTask = async (id: number): Promise<void> => {
  await deleteTaskRepository(id);
};
