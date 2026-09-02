import { Request, Response } from 'express';
import { BloodGroup, RequestStatus, Role } from '@prisma/client';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BloodRequestService } from './bloodRequest.service';

const createRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await BloodRequestService.createRequest(req.user!.userId, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Blood request created successfully',
    data: result,
  });
});

const getRequestById = catchAsync(async (req: Request, res: Response) => {
  const result = await BloodRequestService.getRequestById(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blood request retrieved successfully',
    data: result,
  });
});

const listRequests = catchAsync(async (req: Request, res: Response) => {
  const { status, bloodGroup } = req.query;
  const result = await BloodRequestService.listRequests({
    status: status as RequestStatus | undefined,
    bloodGroup: bloodGroup as BloodGroup | undefined,
  });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blood requests retrieved successfully',
    data: result,
  });
});

const verifyRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await BloodRequestService.verifyRequest(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blood request verified successfully',
    data: result,
  });
});

const cancelRequest = catchAsync(async (req: Request, res: Response) => {
  const isAdmin = req.user!.role === Role.ADMIN;
  const result = await BloodRequestService.cancelRequest(
    req.params.id as string,
    req.user!.userId,
    isAdmin,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blood request cancelled successfully',
    data: result,
  });
});

const getMatches = catchAsync(async (req: Request, res: Response) => {
  const result = await BloodRequestService.getMatches(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Matching donors retrieved successfully',
    data: result,
  });
});

const acceptRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await BloodRequestService.acceptRequest(req.params.id as string, req.user!.userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blood request accepted successfully',
    data: result,
  });
});

export const BloodRequestController = {
  createRequest,
  getRequestById,
  listRequests,
  verifyRequest,
  cancelRequest,
  getMatches,
  acceptRequest,
};
