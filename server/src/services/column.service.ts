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
  try {
    const column = await createColumnRepository(boardId, title);

    return column;
  } catch (err) {
    throw err;
  }
};

export const updateColumn = async (
  userId: number,
  id: number,
  title?: string,
): Promise<ColumnPayload> => {
  try {
    const updatedColumn = updateColumnRepository(userId, id, title);

    if (!updatedColumn) throw new AppError('Column not found.', 404);

    return updatedColumn;
  } catch (err) {
    throw err;
  }
};

export const deleteColumn = async (
  userId: number,
  id: number,
): Promise<void> => {
  try {
    await deleteColumnRepository(userId, id);
  } catch (err) {
    throw err;
  }
};
