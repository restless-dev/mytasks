import { AppError } from '../utils/AppError.js';
import {
  createColumn as createColumnRepository,
  deleteColumn as deleteColumnRepository,
  updateColumn as updateColumnRepository,
} from '../repositories/column.repository.js';
import type { TaskPayload } from './task.service.js';

export type ColumnPayload = {
  boardId: number;
  icon: string;
  id: number;
  tasks: TaskPayload[];
  title: string;
};

export const createColumn = async (
  boardId: number,
  title: string,
  icon?: string,
): Promise<ColumnPayload> => {
  const column = await createColumnRepository(boardId, title, icon);

  return column;
};

export const updateColumn = async (
  userId: number,
  id: number,
  title?: string,
  icon?: string,
): Promise<ColumnPayload> => {
  const updatedColumn = await updateColumnRepository(userId, id, title, icon);

  if (!updatedColumn) throw new AppError('Column not found.', 404);

  return updatedColumn;
};

export const deleteColumn = async (
  userId: number,
  id: number,
): Promise<void> => {
  await deleteColumnRepository(userId, id);
};
