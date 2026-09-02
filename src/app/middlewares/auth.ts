import { NextFunction, Request, Response } from 'express';
import { Role } from '@prisma/client';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import { verifyAccessToken } from '../utils/jwt';
import prisma from '../../config/prisma';

declare global {
  namespace Express {
    interface User {
      userId: string;
      email: string;
      role: Role;
    }
  }
}

const auth = (...allowedRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;

    if (!token) {
      throw new AppError(401, 'You are not authorized. Please log in.');
    }

    const decoded = verifyAccessToken(token);

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) {
      throw new AppError(401, 'This user no longer exists.');
    }

    if (user.isBanned) {
      throw new AppError(403, 'This account has been banned.');
    }

    if (allowedRoles.length && !allowedRoles.includes(user.role)) {
      throw new AppError(403, 'You do not have permission to perform this action.');
    }

    req.user = { userId: user.id, email: user.email, role: user.role };
    next();
  });
};

export default auth;
