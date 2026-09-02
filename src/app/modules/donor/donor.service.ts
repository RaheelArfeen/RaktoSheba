import { BloodGroup } from '@prisma/client';
import prisma from '../../../config/prisma';
import AppError from '../../utils/AppError';
import { isEligibleByLastDonation } from './donor.constant';

type TCreateDonorProfilePayload = {
  bloodGroup: BloodGroup;
  lastDonationAt?: string;
  lat?: number;
  lng?: number;
};

type TUpdateDonorProfilePayload = Partial<TCreateDonorProfilePayload>;

const withEligibility = <T extends { lastDonationAt: Date | null }>(profile: T) => ({
  ...profile,
  isEligible: isEligibleByLastDonation(profile.lastDonationAt),
});

const createProfile = async (userId: string, payload: TCreateDonorProfilePayload) => {
  const existingProfile = await prisma.donorProfile.findUnique({ where: { userId } });

  if (existingProfile) {
    throw new AppError(409, 'Donor profile already exists for this user');
  }

  const profile = await prisma.donorProfile.create({
    data: {
      userId,
      bloodGroup: payload.bloodGroup,
      lastDonationAt: payload.lastDonationAt ? new Date(payload.lastDonationAt) : null,
      lat: payload.lat,
      lng: payload.lng,
    },
  });

  return withEligibility(profile);
};

const getMyProfile = async (userId: string) => {
  const profile = await prisma.donorProfile.findUnique({ where: { userId } });

  if (!profile) {
    throw new AppError(404, 'Donor profile not found');
  }

  return withEligibility(profile);
};

const getDonorById = async (id: string) => {
  const profile = await prisma.donorProfile.findUnique({
    where: { id },
    include: { user: { select: { id: true, email: true } } },
  });

  if (!profile) {
    throw new AppError(404, 'Donor not found');
  }

  return withEligibility(profile);
};

const updateMyProfile = async (userId: string, payload: TUpdateDonorProfilePayload) => {
  const existingProfile = await prisma.donorProfile.findUnique({ where: { userId } });

  if (!existingProfile) {
    throw new AppError(404, 'Donor profile not found');
  }

  const profile = await prisma.donorProfile.update({
    where: { userId },
    data: {
      bloodGroup: payload.bloodGroup,
      lastDonationAt: payload.lastDonationAt ? new Date(payload.lastDonationAt) : undefined,
      lat: payload.lat,
      lng: payload.lng,
    },
  });

  return withEligibility(profile);
};

const updateAvailability = async (userId: string, isAvailable: boolean) => {
  const existingProfile = await prisma.donorProfile.findUnique({ where: { userId } });

  if (!existingProfile) {
    throw new AppError(404, 'Donor profile not found');
  }

  const profile = await prisma.donorProfile.update({
    where: { userId },
    data: { isAvailable },
  });

  return withEligibility(profile);
};

const listDonors = async (filters: { bloodGroup?: BloodGroup; isAvailable?: boolean }) => {
  const profiles = await prisma.donorProfile.findMany({
    where: {
      bloodGroup: filters.bloodGroup,
      isAvailable: filters.isAvailable,
    },
    include: { user: { select: { id: true, email: true } } },
    orderBy: { id: 'desc' },
  });

  return profiles.map(withEligibility);
};

const deleteMyProfile = async (userId: string) => {
  const existingProfile = await prisma.donorProfile.findUnique({ where: { userId } });

  if (!existingProfile) {
    throw new AppError(404, 'Donor profile not found');
  }

  await prisma.donorProfile.delete({ where: { userId } });
};

export const DonorService = {
  createProfile,
  getMyProfile,
  getDonorById,
  updateMyProfile,
  updateAvailability,
  listDonors,
  deleteMyProfile,
};
