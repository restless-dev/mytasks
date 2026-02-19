import type { TaskPayload } from '../services/task.service.js';
import type { Prisma } from '../generated/client/index.js';
import { prisma } from '../lib/prisma.js';

export const getTasks = async (userId: number): Promise<TaskPayload[]> => {
  const tasks = await prisma.task.findMany({
    where: { column: { board: { userId } } },
    orderBy: [{ createdAt: 'desc' }],
    select: {
      columnId: true,
      completed: true,
      description: true,
      icon: true,
      id: true,
      title: true,
      urgent: true,
    },
  });

  return tasks;
};

export const createTask = async (
  columnId: number,
  description: string,
  title: string,
  urgent?: boolean,
  icon?: string,
): Promise<TaskPayload> => {
  const task = await prisma.task.create({
    data: {
      columnId,
      description,
      title,
      urgent: urgent || false,
      ...(icon && { icon }),
    },
    select: {
      columnId: true,
      completed: true,
      description: true,
      icon: true,
      id: true,
      title: true,
      urgent: true,
    },
  });

  return task;
};

export const updateTask = async (
  id: number,
  columnId?: number,
  completed?: boolean,
  description?: string,
  title?: string,
  urgent?: boolean,
  icon?: string,
): Promise<TaskPayload> => {
  const data: Prisma.TaskUpdateInput = {};

  if (columnId !== undefined) data.column = { connect: { id: columnId } };
  if (completed !== undefined) data.completed = completed;
  if (description !== undefined) data.description = description;
  if (title !== undefined) data.title = title;
  if (urgent !== undefined) data.urgent = urgent;
  if (icon !== undefined) data.icon = icon;

  const updatedTask = await prisma.task.update({
    where: { id },
    data,
    select: {
      columnId: true,
      completed: true,
      description: true,
      icon: true,
      id: true,
      title: true,
      urgent: true,
    },
  });

  return updatedTask;
};

export const deleteTask = async (id: number): Promise<void> => {
  await prisma.task.delete({
    where: { id },
  });
};
