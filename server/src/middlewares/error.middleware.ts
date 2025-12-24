import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = { ...err };
  error.message = err.message;

  if (err.code === 'P2002') {
    const message = err.message;
    const match = message.match(/\(`(.+?)`\)/);

    error = new AppError(
      `This ${match?.[1] ?? ''} is already in use.`,
      400
    );
  }

  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token. Please log in again.', 401);
  }
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Your token has expired. Please log in again.', 401);
  }

  const statusCode = error.statusCode || 500;
  const status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(statusCode).json({
      status,
      message: error.message,
      stack: err.stack,
      error: err
    });
  } else {
    if (error.isOperational) {
      res.status(statusCode).json({
        status,
        message: error.message
      });
    } else {
      console.error('ERROR 💥', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong.'
      });
    }
  }
};

export default errorHandler;
