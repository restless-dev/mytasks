import { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';
import { prisma } from '../lib/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined in .env file.');

export const signin: RequestHandler = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    next(err);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError('This email is not signed up.', 401));
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};
