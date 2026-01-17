import { AppError } from '../utils/AppError.js';
import {
  createColumn as createColumnRepository,
  deleteColumn as deleteColumnRepository,
  updateColumn as updateColumnRepository,
} from '../repositories/column.repository.js';
import type { TaskPayload } from './task.service.js';

export type ColumnPayload = {
  boardId: number;
  id: number;
  tasks: TaskPayload[];
  title: string;
};

export const createColumn = async (
  boardId: number,
  title: string,
): Promise<ColumnPayload> => {
  const column = await createColumnRepository(boardId, title);

  return column;
};

export const updateColumn = async (
  userId: number,
  id: number,
  title?: string,
): Promise<ColumnPayload> => {
  const updatedColumn = updateColumnRepository(userId, id, title);

  if (!updatedColumn) throw new AppError('Column not found.', 404);

  return updatedColumn;
};

export const deleteColumn = async (
  userId: number,
  id: number,
): Promise<void> => {
  await deleteColumnRepository(userId, id);
};
