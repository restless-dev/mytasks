import { RequestHandler } from 'express';
import { prisma } from '../lib/prisma.js';

export const getAllUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const updateUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { username }
    });

    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: Number(id) }
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
