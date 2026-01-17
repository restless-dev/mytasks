import type { Prisma } from '../generated/client/index.js';
import { prisma } from '../lib/prisma.js';
import type {
  UserPartial,
  UserWithPassword,
} from '../services/user.service.js';

export const getAllUsers = async (): Promise<UserPartial[]> => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
    },
  });
  return users;
};

export const getUser = async (
  email: string,
): Promise<UserWithPassword | null> => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      username: true,
      email: true,
      password: true,
    },
  });

  return user;
};

export const createUser = async (
  email: string,
  hashedPassword: string,
  username: string,
): Promise<UserPartial> => {
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      boards: {
        create: {
          title: `${username}'s Board`,
          columns: {
            create: {
              title: 'To Do',
            },
          },
        },
      },
    },
    select: {
      id: true,
      username: true,
      email: true,
    },
  });
  return user;
};

export const updateUser = async (
  id: number,
  username?: string,
): Promise<UserPartial> => {
  const data: Prisma.UserUpdateInput = {};

  if (username !== undefined) data.username = username;

  const user = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      username: true,
      email: true,
    },
  });

  return user;
};

export const deleteUser = async (id: number): Promise<void> => {
  await prisma.user.delete({
    where: { id: id },
  });
};
