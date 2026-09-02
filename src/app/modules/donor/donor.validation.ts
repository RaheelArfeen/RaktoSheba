import { z } from 'zod';

const bloodGroupEnum = z.enum([
  'A_POSITIVE',
  'A_NEGATIVE',
  'B_POSITIVE',
  'B_NEGATIVE',
  'AB_POSITIVE',
  'AB_NEGATIVE',
  'O_POSITIVE',
  'O_NEGATIVE',
]);

const createDonorProfileValidationSchema = z.object({
  body: z.object({
    bloodGroup: bloodGroupEnum,
    lastDonationAt: z.string().datetime().optional(),
    lat: z.number().min(-90).max(90).optional(),
    lng: z.number().min(-180).max(180).optional(),
  }),
});

const updateDonorProfileValidationSchema = z.object({
  body: z.object({
    bloodGroup: bloodGroupEnum.optional(),
    lastDonationAt: z.string().datetime().optional(),
    lat: z.number().min(-90).max(90).optional(),
    lng: z.number().min(-180).max(180).optional(),
  }),
});

const updateAvailabilityValidationSchema = z.object({
  body: z.object({
    isAvailable: z.boolean({ required_error: 'isAvailable is required' }),
  }),
});

export const DonorValidation = {
  createDonorProfileValidationSchema,
  updateDonorProfileValidationSchema,
  updateAvailabilityValidationSchema,
};
