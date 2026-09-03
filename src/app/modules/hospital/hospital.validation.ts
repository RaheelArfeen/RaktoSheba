import { z } from 'zod';

const createHospitalProfileValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'name is required' }).min(2),
    address: z.string({ required_error: 'address is required' }).min(5),
  }),
});

const updateHospitalProfileValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    address: z.string().min(5).optional(),
  }),
});

export const HospitalValidation = {
  createHospitalProfileValidationSchema,
  updateHospitalProfileValidationSchema,
};
