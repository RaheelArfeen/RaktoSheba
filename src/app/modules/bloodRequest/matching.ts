import { BloodRequest } from '@prisma/client';
import prisma from '../../../config/prisma';
import { isEligibleByLastDonation } from '../donor/donor.constant';
import { distanceInKm, getCompatibleDonorGroups } from './bloodCompatibility';

/**
 * Compatible + available + eligible donors for a request, sorted by distance (nulls last).
 */
export const findMatchingDonors = async (request: BloodRequest) => {
  const compatibleGroups = getCompatibleDonorGroups(request.bloodGroup);

  const candidates = await prisma.donorProfile.findMany({
    where: {
      bloodGroup: { in: compatibleGroups },
      isAvailable: true,
    },
    include: { user: { select: { id: true, email: true } } },
  });

  const eligibleCandidates = candidates.filter((donor) =>
    isEligibleByLastDonation(donor.lastDonationAt),
  );

  const withDistance = eligibleCandidates.map((donor) => {
    const distanceKm =
      request.lat != null && request.lng != null && donor.lat != null && donor.lng != null
        ? distanceInKm(request.lat, request.lng, donor.lat, donor.lng)
        : null;

    return { ...donor, distanceKm };
  });

  withDistance.sort((a, b) => {
    if (a.distanceKm == null) return 1;
    if (b.distanceKm == null) return -1;
    return a.distanceKm - b.distanceKm;
  });

  return withDistance;
};
