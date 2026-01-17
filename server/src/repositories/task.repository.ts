import type { Prisma } from '../generated/client/index.js';
import { prisma } from '../lib/prisma.js';
import type { TaskPayload } from '../services/task.service.js';

export const getTasks = async (userId: number): Promise<TaskPayload[]> => {
  const tasks = await prisma.task.findMany({
    where: { column: { board: { userId } } },
    orderBy: [{ urgent: 'desc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      title: true,
      description: true,
      completed: true,
      urgent: true,
      columnId: true,
    },
  });

  return tasks;
};

export const createTask = async (
  columnId: number,
  description: string,
  title: string,
  urgent?: boolean,
): Promise<TaskPayload> => {
  const task = await prisma.task.create({
    data: {
      columnId,
      description,
      title,
      urgent: urgent || false,
    },
    select: {
      id: true,
      title: true,
      description: true,
      completed: true,
      urgent: true,
      columnId: true,
    },
  });

  return task;
};

export const updateTask = async (
  id: number,
  completed?: boolean,
  description?: string,
  title?: string,
  urgent?: boolean,
): Promise<TaskPayload> => {
  const data: Prisma.TaskUpdateInput = {};

  if (completed !== undefined) data.completed = completed;
  if (description !== undefined) data.description = description;
  if (title !== undefined) data.title = title;
  if (urgent !== undefined) data.urgent = urgent;

  const result = await prisma.task.update({
    where: {
      id: id,
    },
    data,
    select: {
      id: true,
      title: true,
      description: true,
      completed: true,
      urgent: true,
      columnId: true,
    },
  });

  return result;
};

export const deleteTask = async (id: number): Promise<void> => {
  await prisma.task.delete({
    where: {
      id: id,
    },
  });
};
