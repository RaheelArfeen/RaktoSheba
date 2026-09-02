import { BloodGroup } from '@prisma/client';

/**
 * Maps a recipient's blood group to the donor blood groups that can safely donate to them,
 * per standard ABO/Rh compatibility rules.
 */
const COMPATIBLE_DONORS_FOR_RECIPIENT: Record<BloodGroup, BloodGroup[]> = {
  O_NEGATIVE: ['O_NEGATIVE'],
  O_POSITIVE: ['O_NEGATIVE', 'O_POSITIVE'],
  A_NEGATIVE: ['O_NEGATIVE', 'A_NEGATIVE'],
  A_POSITIVE: ['O_NEGATIVE', 'O_POSITIVE', 'A_NEGATIVE', 'A_POSITIVE'],
  B_NEGATIVE: ['O_NEGATIVE', 'B_NEGATIVE'],
  B_POSITIVE: ['O_NEGATIVE', 'O_POSITIVE', 'B_NEGATIVE', 'B_POSITIVE'],
  AB_NEGATIVE: ['O_NEGATIVE', 'A_NEGATIVE', 'B_NEGATIVE', 'AB_NEGATIVE'],
  AB_POSITIVE: [
    'O_NEGATIVE',
    'O_POSITIVE',
    'A_NEGATIVE',
    'A_POSITIVE',
    'B_NEGATIVE',
    'B_POSITIVE',
    'AB_NEGATIVE',
    'AB_POSITIVE',
  ],
};

export const getCompatibleDonorGroups = (recipientGroup: BloodGroup): BloodGroup[] => {
  return COMPATIBLE_DONORS_FOR_RECIPIENT[recipientGroup];
};

export const isCompatibleDonor = (donorGroup: BloodGroup, recipientGroup: BloodGroup): boolean => {
  return COMPATIBLE_DONORS_FOR_RECIPIENT[recipientGroup].includes(donorGroup);
};

/**
 * Haversine distance between two lat/lng points, in kilometers.
 */
export const distanceInKm = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const earthRadiusKm = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
};
