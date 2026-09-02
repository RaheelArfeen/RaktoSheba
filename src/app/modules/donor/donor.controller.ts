import { Request, Response } from 'express';
import { BloodGroup } from '@prisma/client';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DonorService } from './donor.service';

const createProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await DonorService.createProfile(req.user!.userId, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Donor profile created successfully',
    data: result,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await DonorService.getMyProfile(req.user!.userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Donor profile retrieved successfully',
    data: result,
  });
});

const getDonorById = catchAsync(async (req: Request, res: Response) => {
  const result = await DonorService.getDonorById(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Donor retrieved successfully',
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await DonorService.updateMyProfile(req.user!.userId, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Donor profile updated successfully',
    data: result,
  });
});

const updateAvailability = catchAsync(async (req: Request, res: Response) => {
  const result = await DonorService.updateAvailability(req.user!.userId, req.body.isAvailable);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Availability updated successfully',
    data: result,
  });
});

const listDonors = catchAsync(async (req: Request, res: Response) => {
  const { bloodGroup, isAvailable } = req.query;

  const result = await DonorService.listDonors({
    bloodGroup: bloodGroup as BloodGroup | undefined,
    isAvailable: isAvailable === undefined ? undefined : isAvailable === 'true',
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Donors retrieved successfully',
    data: result,
  });
});

const deleteMyProfile = catchAsync(async (req: Request, res: Response) => {
  await DonorService.deleteMyProfile(req.user!.userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Donor profile deleted successfully',
  });
});

export const DonorController = {
  createProfile,
  getMyProfile,
  getDonorById,
  updateMyProfile,
  updateAvailability,
  listDonors,
  deleteMyProfile,
};
