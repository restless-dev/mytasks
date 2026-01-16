import type { Prisma } from '../generated/client/index.js';
import { prisma } from '../lib/prisma.js';
import type { TaskPayload } from '../services/task.service.js';

export const getTasks = async (userId: number): Promise<TaskPayload[]> => {
  try {
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
  } catch (err) {
    throw err;
  }
};

export const createTask = async (
  columnId: number,
  description: string,
  title: string,
  urgent?: boolean,
): Promise<TaskPayload> => {
  try {
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
  } catch (err) {
    throw err;
  }
};

export const updateTask = async (
  id: number,
  completed?: boolean,
  description?: string,
  title?: string,
  urgent?: boolean,
): Promise<TaskPayload> => {
  try {
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
  } catch (err) {
    throw err;
  }
};

export const deleteTask = async (id: number): Promise<void> => {
  try {
    await prisma.task.delete({
      where: {
        id: id,
      },
    });
  } catch (err) {
    throw err;
  }
};
