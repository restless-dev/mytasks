import { AppError } from '../utils/AppError.js';
import {
  deleteUser as deleteUserRepository,
  getAllUsers as getAllUsersRepository,
  updateUser as updateUserRepository,
} from '../repositories/user.repository.js';

export type UserPartial = {
  email: string;
  id: number;
  username: string;
};

export type UserWithPassword = UserPartial & {
  password: string;
};

export const getAllUsers = async (): Promise<UserPartial[]> => {
  try {
    const users = await getAllUsersRepository();
    return users;
  } catch (err) {
    throw err;
  }
};

export const updateUser = async (
  id: number,
  loggedUserId: number,
  username?: string,
): Promise<UserPartial> => {
  try {
    if (id !== loggedUserId) {
      throw new AppError(
        'Only logged-in users can update their accounts.',
        403,
      );
    }

    const user = await updateUserRepository(id, username);
    return user;
  } catch (err) {
    throw err;
  }
};

export const deleteUser = async (
  id: number,
  loggedUserId: number,
): Promise<void> => {
  try {
    if (id !== loggedUserId) {
      throw new AppError(
        'Only logged-in users can delete their accounts.',
        403,
      );
    }

    await deleteUserRepository(id);
  } catch (err) {
    throw err;
  }
};
