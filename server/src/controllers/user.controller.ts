import type { NextFunction, Request, Response } from 'express';
import {
  deleteUser as deleteUserService,
  getAllUsers as getAllUsersService,
  updateUser as updateUserService,
} from '../services/user.service.js';

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const users = await getAllUsersService();

    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = Number(req.params.id);
    const loggedUserId = req.user!.userId;
    const { username } = req.body;

    const updatedUser = await updateUserService(userId, loggedUserId, username);

    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = Number(req.params.id);
    const loggedInUserId = req.user!.userId;

    await deleteUserService(userId, loggedInUserId);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
