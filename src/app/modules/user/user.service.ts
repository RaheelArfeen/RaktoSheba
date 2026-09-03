import prisma from '../../../config/prisma';
import AppError from '../../utils/AppError';

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      isVolunteer: true,
      isBanned: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  return user;
};

const updateMe = async (userId: string, payload: { email?: string }) => {
  if (payload.email) {
    const existing = await prisma.user.findFirst({
      where: { email: payload.email, NOT: { id: userId } },
    });

    if (existing) {
      throw new AppError(409, 'This email is already in use');
    }
  }

  return prisma.user.update({
    where: { id: userId },
    data: { email: payload.email },
    select: { id: true, email: true, role: true, isVolunteer: true },
  });
};

export const UserService = {
  getMe,
  updateMe,
};
