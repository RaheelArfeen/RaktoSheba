import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import { UserController } from './user.controller';

const router = express.Router();

router.get('/me', auth(), UserController.getMe);

router.patch('/me', auth(), validateRequest(UserValidation.updateMeValidationSchema), UserController.updateMe);

export const UserRoutes = router;
