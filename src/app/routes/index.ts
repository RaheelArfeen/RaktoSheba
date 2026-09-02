import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { DonorRoutes } from '../modules/donor/donor.route';
import { BloodRequestRoutes } from '../modules/bloodRequest/bloodRequest.route';
import { NotificationRoutes } from '../modules/notification/notification.route';

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
