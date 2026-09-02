import { BloodGroup, Prisma, RequestStatus } from '@prisma/client';
import prisma from '../../../config/prisma';
import AppError from '../../utils/AppError';
import { isEligibleByLastDonation } from '../donor/donor.constant';
import { getCompatibleDonorGroups } from './bloodCompatibility';
import { findMatchingDonors } from './matching';
import { NotificationService } from '../notification/notification.service';

type TCreateBloodRequestPayload = {
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  urgency?: number;
  lat?: number;
  lng?: number;
};

const createRequest = async (requesterId: string, payload: TCreateBloodRequestPayload) => {
  return prisma.bloodRequest.create({
    data: {
      requesterId,
      bloodGroup: payload.bloodGroup,
      unitsNeeded: payload.unitsNeeded,
      urgency: payload.urgency ?? 1,
      lat: payload.lat,
      lng: payload.lng,
    },
  });
};

const getRequestById = async (id: string) => {
  const request = await prisma.bloodRequest.findUnique({
    where: { id },
    include: { donation: true },
  });

  if (!request) {
    throw new AppError(404, 'Blood request not found');
  }

  return request;
};

const listRequests = async (filters: { status?: RequestStatus; bloodGroup?: BloodGroup }) => {
  return prisma.bloodRequest.findMany({
    where: {
      status: filters.status,
      bloodGroup: filters.bloodGroup,
    },
    orderBy: [{ urgency: 'desc' }, { createdAt: 'desc' }],
  });
};

const verifyRequest = async (id: string) => {
  const request = await prisma.bloodRequest.findUnique({ where: { id } });

  if (!request) {
    throw new AppError(404, 'Blood request not found');
  }

  if (request.status !== RequestStatus.PENDING) {
    throw new AppError(400, `Cannot verify a request with status ${request.status}`);
  }

  const verifiedRequest = await prisma.bloodRequest.update({
    where: { id },
    data: { status: RequestStatus.VERIFIED },
  });

  await NotificationService.fanOutForRequest(verifiedRequest);

  return verifiedRequest;
};

const cancelRequest = async (id: string, requesterId: string, isAdmin: boolean) => {
  const request = await prisma.bloodRequest.findUnique({ where: { id } });

  if (!request) {
    throw new AppError(404, 'Blood request not found');
  }

  if (!isAdmin && request.requesterId !== requesterId) {
    throw new AppError(403, 'You can only cancel your own requests');
  }

  if (request.status === RequestStatus.FULFILLED) {
    throw new AppError(400, 'Cannot cancel a fulfilled request');
  }

  return prisma.bloodRequest.update({
    where: { id },
    data: { status: RequestStatus.CANCELLED },
  });
};

const getMatches = async (requestId: string) => {
  const request = await prisma.bloodRequest.findUnique({ where: { id: requestId } });

  if (!request) {
    throw new AppError(404, 'Blood request not found');
  }

  return findMatchingDonors(request);
};

const acceptRequest = async (requestId: string, donorUserId: string) => {
  const request = await prisma.bloodRequest.findUnique({ where: { id: requestId } });

  if (!request) {
    throw new AppError(404, 'Blood request not found');
  }

  if (request.status === RequestStatus.FULFILLED || request.status === RequestStatus.CANCELLED) {
    throw new AppError(400, `This request is already ${request.status.toLowerCase()}`);
  }

  const donorProfile = await prisma.donorProfile.findUnique({ where: { userId: donorUserId } });

  if (!donorProfile) {
    throw new AppError(404, 'Donor profile not found. Create a donor profile first.');
  }

  if (!donorProfile.isAvailable) {
    throw new AppError(400, 'You are marked as unavailable. Update your availability first.');
  }

  if (!isEligibleByLastDonation(donorProfile.lastDonationAt)) {
    throw new AppError(400, 'You are not yet eligible to donate (must wait 90 days between donations)');
  }

  const compatibleGroups = getCompatibleDonorGroups(request.bloodGroup);

  if (!compatibleGroups.includes(donorProfile.bloodGroup)) {
    throw new AppError(400, 'Your blood group is not compatible with this request');
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const donation = await tx.donation.create({
        data: {
          donorId: donorProfile.id,
          requestId: request.id,
          scheduledAt: new Date(),
        },
      });

      await tx.bloodRequest.update({
        where: { id: request.id },
        data: { status: RequestStatus.MATCHED },
      });

      return donation;
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new AppError(409, 'This request has already been matched with another donor');
    }
    throw error;
  }
};

export const BloodRequestService = {
  createRequest,
  getRequestById,
  listRequests,
  verifyRequest,
  cancelRequest,
  getMatches,
  acceptRequest,
};
