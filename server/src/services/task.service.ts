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
  try {
    const tasks = await getTasksRepository(userId);

    return tasks;
  } catch (err) {
    throw err;
  }
};

export const createTask = async (
  columnId: number,
  description: string,
  title: string,
  urgent?: boolean,
): Promise<TaskPayload> => {
  try {
    const task = await createTaskRepository(
      columnId,
      description,
      title,
      urgent,
    );

    return task;
  } catch (err) {
    throw err;
  }
};

export const updateTask = async (
  id: number,
  completed?: boolean,
  description?: string,
  title?: string,
  urgent?: boolean,
): Promise<TaskPayload> => {
  try {
    const updatedTask = updateTaskRepository(
      id,
      completed,
      description,
      title,
      urgent,
    );

    if (!updatedTask) throw new AppError('Task not found.', 404);

    return updatedTask;
  } catch (err) {
    throw err;
  }
};

export const deleteTask = async (id: number): Promise<void> => {
  try {
    await deleteTaskRepository(id);
  } catch (err) {
    throw err;
  }
};
