import type { BoardPayload } from '../services/board.service.js';
import type { Prisma } from '../generated/client/index.js';
import { prisma } from '../lib/prisma.js';

export const getBoards = async (userId: number): Promise<BoardPayload[]> => {
  try {
    const boards = await prisma.board.findMany({
      where: { userId },
      orderBy: [{ createdAt: 'desc' }],
      select: {
        id: true,
        title: true,
        userId: true,
        columns: {
          select: {
            id: true,
            title: true,
            boardId: true,
            tasks: {
              select: {
                id: true,
                title: true,
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

    return boards;
  } catch (err) {
    throw err;
  }
};

export const createBoard = async (
  userId: number,
  title: string,
): Promise<BoardPayload> => {
  try {
    const board = await prisma.board.create({
      data: {
        title,
        userId,
        columns: { create: { title: 'To Do' } },
      },
      select: {
        id: true,
        title: true,
        userId: true,
        columns: {
          select: {
            id: true,
            title: true,
            boardId: true,
            tasks: true,
          },
        },
      },
    });

    return board;
  } catch (err) {
    throw err;
  }
};

export const updateBoard = async (
  id: number,
  userId: number,
  title?: string,
): Promise<BoardPayload> => {
  try {
    const data: Prisma.BoardUpdateInput = {};

    if (title !== undefined) data.title = title;

    const updatedBoard = await prisma.board.update({
      where: {
        id: id,
        userId,
      },
      data,
      select: {
        id: true,
        title: true,
        userId: true,
        columns: {
          select: {
            id: true,
            title: true,
            boardId: true,
            tasks: {
              select: {
                id: true,
                title: true,
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
  } catch (err) {
    throw err;
  }
};

export const deleteBoard = async (
  id: number,
  userId: number,
): Promise<void> => {
  try {
    await prisma.board.delete({
      where: {
        id: id,
        userId: userId,
      },
    });
  } catch (err) {
    throw err;
  }
};
