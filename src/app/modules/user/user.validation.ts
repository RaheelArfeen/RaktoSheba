import { z } from 'zod';

const updateMeValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address').optional(),
  }),
});

export const UserValidation = {
  updateMeValidationSchema,
};
