import type { BoardPayload } from '../services/board.service.js';
import type { Prisma } from '../generated/client/index.js';
import { prisma } from '../lib/prisma.js';

export const getBoards = async (userId: number): Promise<BoardPayload[]> => {
  const boards = await prisma.board.findMany({
    where: { userId },
    orderBy: [{ createdAt: 'desc' }],
    select: {
      icon: true,
      id: true,
      title: true,
      userId: true,
      columns: {
        orderBy: { id: 'asc' },
        select: {
          icon: true,
          id: true,
          title: true,
          boardId: true,
          tasks: {
            orderBy: { id: 'asc' },
            select: {
              id: true,
              title: true,
              description: true,
              completed: true,
              urgent: true,
              columnId: true,
              icon: true,
            },
          },
        },
      },
    },
  });

  return boards;
};

export const createBoard = async (
  userId: number,
  title: string,
  icon?: string,
): Promise<BoardPayload> => {
  const board = await prisma.board.create({
    data: {
      title,
      userId,
      ...(icon && { icon }),
      columns: { create: { title: 'To Do' } },
    },
    select: {
      icon: true,
      id: true,
      title: true,
      userId: true,
      columns: {
        select: {
          icon: true,
          id: true,
          title: true,
          boardId: true,
          tasks: true,
        },
      },
    },
  });

  return board;
};

export const updateBoard = async (
  id: number,
  userId: number,
  title?: string,
  icon?: string,
): Promise<BoardPayload> => {
  const data: Prisma.BoardUpdateInput = {};

  if (title !== undefined) data.title = title;
  if (icon !== undefined) data.icon = icon;

  const updatedBoard = await prisma.board.update({
    where: {
      id: id,
      userId,
    },
    data,
    select: {
      icon: true,
      id: true,
      title: true,
      userId: true,
      columns: {
        orderBy: { id: 'asc' },
        select: {
          icon: true,
          id: true,
          title: true,
          boardId: true,
          tasks: {
            orderBy: { id: 'asc' },
            select: {
              id: true,
              title: true,
              icon: true,
              description: true,
              completed: true,
              urgent: true,
              columnId: true,
            },
          },
        },
      },
    },
  });

  return updatedBoard;
};

export const deleteBoard = async (
  id: number,
  userId: number,
): Promise<void> => {
  await prisma.board.delete({
    where: {
      id: id,
      userId: userId,
    },
  });
};
