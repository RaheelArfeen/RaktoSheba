import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminService } from './admin.service';
import { AuditLogService } from '../auditLog/auditLog.service';

const banUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.setUserBanStatus(req.user!.userId, req.params.id as string, true);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User banned successfully',
    data: result,
  });
});

const unbanUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.setUserBanStatus(req.user!.userId, req.params.id as string, false);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User unbanned successfully',
    data: result,
  });
});

const verifyHospital = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.verifyHospital(req.user!.userId, req.params.id as string);
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

const listAuditLogs = catchAsync(async (req: Request, res: Response) => {
  const { logs, meta } = await AuditLogService.listLogs(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Audit logs retrieved successfully',
    data: logs,
    meta,
  });
});

export const AdminController = {
  banUser,
  unbanUser,
  verifyHospital,
  getAnalytics,
  listAuditLogs,
};
