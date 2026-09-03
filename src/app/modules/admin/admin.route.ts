import express from 'express';
import { Role } from '@prisma/client';
import auth from '../../middlewares/auth';
import { AdminController } from './admin.controller';

const router = express.Router();

router.use(auth(Role.ADMIN));

router.patch('/users/:id/ban', AdminController.banUser);

router.patch('/users/:id/unban', AdminController.unbanUser);

router.patch('/hospitals/:id/verify', AdminController.verifyHospital);

router.get('/analytics', AdminController.getAnalytics);

export const AdminRoutes = router;
