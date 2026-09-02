import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import AppError from '../utils/AppError';

const globalErrorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = 'Something went wrong';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = err.issues.map((issue) => issue.message).join(', ');
  } else if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default globalErrorHandler;
