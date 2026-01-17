import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';
import { createUser, getUser } from '../repositories/user.repository.js';
import type { UserPartial } from './user.service.js';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined in .env file.');

type UserPayload = {
  user: UserPartial;
  token: string;
};

export const signup = async (
  email: string,
  password: string,
  username: string,
): Promise<UserPartial> => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await createUser(email, hashedPassword, username);

  return user;
};

export const login = async (
  email: string,
  password: string,
): Promise<UserPayload> => {
  const user = await getUser(email);

  if (!user) throw new AppError('This email is not signed up.', 401);

  if (!(await bcrypt.compare(password, user.password!))) {
    throw new AppError('This password is incorrect.', 401);
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '1h',
  });

  return { user, token };
};
