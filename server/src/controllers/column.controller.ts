import type { Request, Response, NextFunction } from 'express';
import {
  createColumn as createColumnService,
  deleteColumn as deleteColumnService,
  updateColumn as updateColumnService,
} from '../services/column.service.js';

export const createColumn = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { boardId, title } = req.body;

    const column = await createColumnService(Number(boardId), title);

    res.status(201).json(column);
  } catch (err) {
    next(err);
  }
};

export const updateColumn = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const { title } = req.body;

    const updatedColumn = await updateColumnService(userId, Number(id), title);
    res.json(updatedColumn);
  } catch (err) {
    next(err);
  }
};

export const deleteColumn = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    await deleteColumnService(userId, Number(id));

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
