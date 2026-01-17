import type { ColumnPayload } from '../services/column.service.js';
import type { Prisma } from '../generated/client/index.js';
import { prisma } from '../lib/prisma.js';

export const createColumn = async (
  boardId: number,
  title: string,
): Promise<ColumnPayload> => {
  const column = await prisma.column.create({
    data: {
      boardId,
      title,
    },
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
  });

  return column;
};

export const updateColumn = async (
  userId: number,
  id: number,
  title?: string,
): Promise<ColumnPayload> => {
  const data: Prisma.ColumnUpdateInput = {};

  if (title !== undefined) data.title = title;

  const updatedColumn = await prisma.column.update({
    where: {
      id: id,
      board: { user: { id: userId } },
    },
    data,
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
  });

  return updatedColumn;
};

export const deleteColumn = async (
  userId: number,
  id: number,
): Promise<void> => {
  await prisma.column.deleteMany({
    where: {
      id: id,
      board: { user: { id: userId } },
    },
  });
};
