import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined in .env file');

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'No session token was found. Please restart your session.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
    req.user = decoded;

    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid session token.' });
  }
};
