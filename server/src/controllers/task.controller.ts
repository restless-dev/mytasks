import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
import { prisma } from '../lib/prisma.js';

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { title, description } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        userId
      }
    });

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const result = await prisma.task.updateMany({
      where: {
        id: Number(id),
        userId
      },
      data: {
        title,
        description,
        completed
      }
    });

    if (result.count === 0) return next(new AppError('Task not found.', 404));

    const updatedTask = await prisma.task.findUnique({ where: { id: Number(id) } });
    res.json(updatedTask);
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const result = await prisma.task.deleteMany({
      where: {
        id: Number(id),
        userId: userId
      }
    });

    if (result.count === 0) return next(new AppError('Task not found.', 404));

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
