import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError.js';
import {
  login as loginService,
  signup as signupService,
} from '../services/auth.service.js';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET)
  throw new AppError('JWT_SECRET is not defined in .env file.', 400);

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    const user = await signupService(email, password, username);

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const { user, token } = await loginService(email, password);

    res.json({
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
};
