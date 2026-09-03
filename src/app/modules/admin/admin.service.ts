import { DonationStatus, RequestStatus } from '@prisma/client';
import prisma from '../../../config/prisma';
import AppError from '../../utils/AppError';

const setUserBanStatus = async (userId: string, isBanned: boolean) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  return prisma.user.update({
    where: { id: userId },
    data: { isBanned },
    select: { id: true, email: true, role: true, isBanned: true },
  });
};

const verifyHospital = async (hospitalId: string) => {
  const hospital = await prisma.hospital.findUnique({ where: { id: hospitalId } });

  if (!hospital) {
    throw new AppError(404, 'Hospital not found');
  }

  if (hospital.verified) {
    throw new AppError(400, 'This hospital is already verified');
  }

  return prisma.hospital.update({
    where: { id: hospitalId },
    data: { verified: true },
  });
};

const getAnalytics = async () => {
  const [
    totalDonors,
    availableDonors,
    totalHospitals,
    verifiedHospitals,
    requestsByStatus,
    completedDonations,
    bannedUsers,
  ] = await Promise.all([
    prisma.donorProfile.count(),
    prisma.donorProfile.count({ where: { isAvailable: true } }),
    prisma.hospital.count(),
    prisma.hospital.count({ where: { verified: true } }),
    prisma.bloodRequest.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.donation.count({ where: { status: DonationStatus.COMPLETED } }),
    prisma.user.count({ where: { isBanned: true } }),
  ]);

  const requestCounts = Object.fromEntries(
    Object.values(RequestStatus).map((status) => [
      status,
      requestsByStatus.find((r) => r.status === status)?._count._all ?? 0,
    ]),
  );

  const totalRequests = Object.values(requestCounts).reduce((sum, count) => sum + count, 0);

  return {
    donors: { total: totalDonors, available: availableDonors },
    hospitals: { total: totalHospitals, verified: verifiedHospitals },
    requests: { total: totalRequests, byStatus: requestCounts },
    donationsCompleted: completedDonations,
    bannedUsers,
  };
};

export const AdminService = {
  setUserBanStatus,
  verifyHospital,
  getAnalytics,
};
