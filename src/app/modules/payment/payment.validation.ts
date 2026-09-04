import { z } from 'zod';

const initiatePaymentValidationSchema = z.object({
  body: z.object({
    amount: z.number({ required_error: 'amount is required' }).positive('amount must be greater than 0'),
    purpose: z.enum(['PLATFORM_DONATION', 'EMERGENCY_FUND'], {
      required_error: 'purpose is required',
    }),
    requestId: z.string().uuid().optional(),
  }),
});

export const PaymentValidation = {
  initiatePaymentValidationSchema,
};
