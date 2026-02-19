import type { NextFunction, Request, Response } from 'express';
import {
  createBoard as createBoardService,
  deleteBoard as deleteBoardService,
  getBoards as getBoardsService,
  updateBoard as updateBoardService,
} from '../services/board.service.js';

export const getBoards = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const boards = await getBoardsService(userId);

    res.json(boards);
  } catch (err) {
    next(err);
  }
};

export const createBoard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { icon, title } = req.body;

    const board = await createBoardService(userId, title, icon);

    res.status(201).json(board);
  } catch (err) {
    next(err);
  }
};

export const updateBoard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const { icon, title } = req.body;

    const updatedBoard = await updateBoardService(
      userId,
      Number(id),
      title,
      icon,
    );

    res.json(updatedBoard);
  } catch (err) {
    next(err);
  }
};

export const deleteBoard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    await deleteBoardService(Number(id), userId);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
