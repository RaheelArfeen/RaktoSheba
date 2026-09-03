import express from 'express';
import { Role } from '@prisma/client';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { HospitalValidation } from './hospital.validation';
import { HospitalController } from './hospital.controller';

const router = express.Router();

router.post(
  '/',
  auth(Role.HOSPITAL),
  validateRequest(HospitalValidation.createHospitalProfileValidationSchema),
  HospitalController.createProfile,
);

router.get('/me', auth(Role.HOSPITAL), HospitalController.getMyProfile);

router.patch(
  '/me',
  auth(Role.HOSPITAL),
  validateRequest(HospitalValidation.updateHospitalProfileValidationSchema),
  HospitalController.updateMyProfile,
);

router.get('/', auth(Role.ADMIN), HospitalController.listHospitals);

export const HospitalRoutes = router;
