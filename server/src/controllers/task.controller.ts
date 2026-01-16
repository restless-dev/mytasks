import type { Request, Response, NextFunction } from 'express';
import {
  createTask as createTaskService,
  deleteTask as deleteTaskService,
  getTasks as getTasksService,
  updateTask as updateTaskService,
} from '../services/task.service.js';

export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const tasks = await getTasksService(userId);

    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { columnId, description, title, urgent } = req.body;

    const task = await createTaskService(
      Number(columnId),
      description,
      title,
      urgent,
    );

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { completed, description, title, urgent } = req.body;

    const updatedTask = await updateTaskService(
      Number(id),
      completed,
      description,
      title,
      urgent,
    );

    res.json(updatedTask);
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    await deleteTaskService(Number(id));

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
