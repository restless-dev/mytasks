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
): Promise<BoardPayload> => {
  const board = await createBoardRepository(userId, title);

  return board;
};

export const updateBoard = async (
  userId: number,
  id: number,
  title?: string,
): Promise<BoardPayload> => {
  const updatedBoard = updateBoardRepository(id, userId, title);

  if (!updatedBoard) throw new AppError('Board not found.', 404);

  return updatedBoard;
};

export const deleteBoard = async (
  id: number,
  userId: number,
): Promise<void> => {
  await deleteBoardRepository(id, userId);
};
