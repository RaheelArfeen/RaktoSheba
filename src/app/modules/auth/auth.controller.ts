import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthService } from './auth.service';

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Logged in successfully',
    data: result,
  });
});

const refresh = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.refresh(req.body.refreshToken);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Access token refreshed successfully',
    data: result,
  });
});

export const AuthController = {
  register,
  login,
  refresh,
};
