import { DonationStatus, RequestStatus } from '@prisma/client';
import prisma from '../../../config/prisma';
import AppError from '../../utils/AppError';
import { AuditLogService } from '../auditLog/auditLog.service';

const setUserBanStatus = async (actorId: string, userId: string, isBanned: boolean) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { isBanned },
    select: { id: true, email: true, role: true, isBanned: true },
  });

  await AuditLogService.log(actorId, isBanned ? 'BAN_USER' : 'UNBAN_USER', 'User', userId);

  return updated;
};

const verifyHospital = async (actorId: string, hospitalId: string) => {
  const hospital = await prisma.hospital.findUnique({ where: { id: hospitalId } });

  if (!hospital) {
    throw new AppError(404, 'Hospital not found');
  }

  if (hospital.verified) {
    throw new AppError(400, 'This hospital is already verified');
  }

  const updated = await prisma.hospital.update({
    where: { id: hospitalId },
    data: { verified: true },
  });

  await AuditLogService.log(actorId, 'VERIFY_HOSPITAL', 'Hospital', hospitalId);

  return updated;
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
    prisma.donorProfile.count({ where: { deletedAt: null } }),
    prisma.donorProfile.count({ where: { deletedAt: null, isAvailable: true } }),
    prisma.hospital.count({ where: { deletedAt: null } }),
    prisma.hospital.count({ where: { deletedAt: null, verified: true } }),
    prisma.bloodRequest.groupBy({ by: ['status'], where: { deletedAt: null }, _count: { _all: true } }),
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
