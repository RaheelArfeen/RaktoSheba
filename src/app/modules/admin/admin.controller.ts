import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminService } from './admin.service';

const banUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.setUserBanStatus(req.params.id as string, true);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User banned successfully',
    data: result,
  });
});

const unbanUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.setUserBanStatus(req.params.id as string, false);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User unbanned successfully',
    data: result,
  });
});

const verifyHospital = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.verifyHospital(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Hospital verified successfully',
    data: result,
  });
});

const getAnalytics = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAnalytics();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Analytics retrieved successfully',
    data: result,
  });
});

export const AdminController = {
  banUser,
  unbanUser,
  verifyHospital,
  getAnalytics,
};
