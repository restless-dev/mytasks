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
  try {
    const boards = await getBoardsRepository(userId);

    return boards;
  } catch (err) {
    throw err;
  }
};

export const createBoard = async (
  userId: number,
  title: string,
): Promise<BoardPayload> => {
  try {
    const board = await createBoardRepository(userId, title);

    return board;
  } catch (err) {
    throw err;
  }
};

export const updateBoard = async (
  userId: number,
  id: number,
  title?: string,
): Promise<BoardPayload> => {
  try {
    const updatedBoard = updateBoardRepository(id, userId, title);

    if (!updatedBoard) throw new AppError('Board not found.', 404);

    return updatedBoard;
  } catch (err) {
    throw err;
  }
};

export const deleteBoard = async (
  id: number,
  userId: number,
): Promise<void> => {
  try {
    await deleteBoardRepository(id, userId);
  } catch (err) {
    throw err;
  }
};
