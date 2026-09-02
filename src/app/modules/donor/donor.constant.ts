export const MIN_DAYS_BETWEEN_DONATIONS = 90;

export const isEligibleByLastDonation = (lastDonationAt: Date | null): boolean => {
  if (!lastDonationAt) return true;

  const daysSinceLastDonation =
    (Date.now() - lastDonationAt.getTime()) / (1000 * 60 * 60 * 24);

  return daysSinceLastDonation >= MIN_DAYS_BETWEEN_DONATIONS;
};
