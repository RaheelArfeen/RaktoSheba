import prisma from '../../../config/prisma';
import AppError from '../../utils/AppError';

type THospitalPayload = {
  name: string;
  address: string;
};

const createProfile = async (userId: string, payload: THospitalPayload) => {
  const existingProfile = await prisma.hospital.findUnique({ where: { userId } });

  if (existingProfile) {
    throw new AppError(409, 'Hospital profile already exists for this user');
  }

  return prisma.hospital.create({
    data: {
      userId,
      name: payload.name,
      address: payload.address,
    },
  });
};

const getMyProfile = async (userId: string) => {
  const profile = await prisma.hospital.findUnique({ where: { userId } });

  if (!profile) {
    throw new AppError(404, 'Hospital profile not found');
  }

  return profile;
};

const updateMyProfile = async (userId: string, payload: Partial<THospitalPayload>) => {
  const existingProfile = await prisma.hospital.findUnique({ where: { userId } });

  if (!existingProfile) {
    throw new AppError(404, 'Hospital profile not found');
  }

  return prisma.hospital.update({
    where: { userId },
    data: payload,
  });
};

const listHospitals = async () => {
  return prisma.hospital.findMany({
    include: { user: { select: { id: true, email: true } } },
    orderBy: { id: 'desc' },
  });
};

export const HospitalService = {
  createProfile,
  getMyProfile,
  updateMyProfile,
  listHospitals,
};
