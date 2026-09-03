import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { DonorRoutes } from '../modules/donor/donor.route';
import { BloodRequestRoutes } from '../modules/bloodRequest/bloodRequest.route';
import { NotificationRoutes } from '../modules/notification/notification.route';
import { HospitalRoutes } from '../modules/hospital/hospital.route';
import { AdminRoutes } from '../modules/admin/admin.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/donors',
    route: DonorRoutes,
  },
  {
    path: '/requests',
    route: BloodRequestRoutes,
  },
  {
    path: '/notifications',
    route: NotificationRoutes,
  },
  {
    path: '/hospitals',
    route: HospitalRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
