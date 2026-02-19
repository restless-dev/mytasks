import { AppError } from '../utils/AppError.js';
import type { ColumnPayload } from './column.service.js';
import {
  createBoard as createBoardRepository,
  deleteBoard as deleteBoardRepository,
  getBoards as getBoardsRepository,
  updateBoard as updateBoardRepository,
} from '../repositories/board.repository.js';

export type BoardPayload = {
  columns: ColumnPayload[];
  icon: string;
  id: number;
  title: string;
  userId: number;
};

export const getBoards = async (userId: number): Promise<BoardPayload[]> => {
  const boards = await getBoardsRepository(userId);

  return boards;
};

export const createBoard = async (
  userId: number,
  title: string,
  icon?: string,
): Promise<BoardPayload> => {
  const board = await createBoardRepository(userId, title, icon);

  return board;
};

export const updateBoard = async (
  userId: number,
  id: number,
  title?: string,
  icon?: string,
): Promise<BoardPayload> => {
  const updatedBoard = await updateBoardRepository(id, userId, title, icon);

  if (!updatedBoard) throw new AppError('Board not found.', 404);

  return updatedBoard;
};

export const deleteBoard = async (
  id: number,
  userId: number,
): Promise<void> => {
  await deleteBoardRepository(id, userId);
};
