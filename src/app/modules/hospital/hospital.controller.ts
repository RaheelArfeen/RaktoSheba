import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { HospitalService } from './hospital.service';

const createProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await HospitalService.createProfile(req.user!.userId, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Hospital profile created successfully',
    data: result,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await HospitalService.getMyProfile(req.user!.userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Hospital profile retrieved successfully',
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await HospitalService.updateMyProfile(req.user!.userId, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Hospital profile updated successfully',
    data: result,
  });
});

const listHospitals = catchAsync(async (req: Request, res: Response) => {
  const result = await HospitalService.listHospitals();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Hospitals retrieved successfully',
    data: result,
  });
});

export const HospitalController = {
  createProfile,
  getMyProfile,
  updateMyProfile,
  listHospitals,
};
