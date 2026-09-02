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

const createBloodRequestValidationSchema = z.object({
  body: z.object({
    bloodGroup: bloodGroupEnum,
    unitsNeeded: z.number({ required_error: 'unitsNeeded is required' }).int().positive(),
    urgency: z.number().int().min(1).max(5).optional(),
    lat: z.number().min(-90).max(90).optional(),
    lng: z.number().min(-180).max(180).optional(),
  }),
});

export const BloodRequestValidation = {
  createBloodRequestValidationSchema,
};
