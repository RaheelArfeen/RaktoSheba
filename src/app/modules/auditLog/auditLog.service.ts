import { Prisma } from '@prisma/client';
import prisma from '../../../config/prisma';
import { parsePagination, TPaginationParams } from '../../utils/pagination';

const log = async (
  actorId: string,
  action: string,
  targetType: string,
  targetId: string,
  metadata?: Prisma.InputJsonValue,
) => {
  return prisma.auditLog.create({
    data: { actorId, action, targetType, targetId, metadata },
  });
};

const listLogs = async (query: TPaginationParams) => {
  const { page, limit, skip } = parsePagination(query);

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { actor: { select: { id: true, email: true, role: true } } },
    }),
    prisma.auditLog.count(),
  ]);

  return { logs, meta: { page, limit, total } };
};

export const AuditLogService = {
  log,
  listLogs,
};
