import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import AppError, { TErrorDetail } from '../utils/AppError';

const globalErrorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = 'Something went wrong';
  let errors: TErrorDetail[] = [];

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    errors = err.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;
    message = 'Database request failed';
    errors = [{ message: `${err.code}: ${err.message.split('\n').pop()?.trim() ?? err.message}` }];
  } else if (err instanceof Error) {
    message = err.message;
    errors = [{ message: err.message }];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

export default globalErrorHandler;
