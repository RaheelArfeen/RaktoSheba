import { BloodRequest } from '@prisma/client';
import prisma from '../../../config/prisma';
import AppError from '../../utils/AppError';
import { sendEmail } from '../../../config/mailer';
import { findMatchingDonors } from '../bloodRequest/matching';

const fanOutForRequest = async (request: BloodRequest) => {
  const matchingDonors = await findMatchingDonors(request);

  const notifications = await Promise.all(
    matchingDonors.map((donor) =>
      prisma.notification.create({
        data: {
          userId: donor.user.id,
          requestId: request.id,
          channel: 'email',
        },
      }),
    ),
  );

  const emailResults = await Promise.allSettled(
    matchingDonors.map((donor) =>
      sendEmail(
        donor.user.email,
        'RaktoSheba: A compatible blood request needs you',
        `A patient needs ${request.unitsNeeded} unit(s) of ${request.bloodGroup.replace('_', ' ')} blood. ` +
          `You are a compatible, eligible donor. Log in to RaktoSheba to accept this request.`,
      ),
    ),
  );

  emailResults.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(
        `[notification] failed to email ${matchingDonors[index]?.user.email}:`,
        result.reason,
      );
    }
  });

  return notifications.length;
};

const listMyNotifications = async (userId: string) => {
  return prisma.notification.findMany({
    where: { userId },
    include: { request: true },
    orderBy: { sentAt: 'desc' },
  });
};

const markAsRead = async (id: string, userId: string) => {
  const notification = await prisma.notification.findUnique({ where: { id } });

  if (!notification) {
    throw new AppError(404, 'Notification not found');
  }

  if (notification.userId !== userId) {
    throw new AppError(403, 'You can only mark your own notifications as read');
  }

  return prisma.notification.update({
    where: { id },
    data: { readAt: new Date() },
  });
};

export const NotificationService = {
  fanOutForRequest,
  listMyNotifications,
  markAsRead,
};
