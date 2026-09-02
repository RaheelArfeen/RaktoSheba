import express from 'express';
import auth from '../../middlewares/auth';
import { NotificationController } from './notification.controller';

const router = express.Router();

router.get('/me', auth(), NotificationController.listMyNotifications);

router.patch('/:id/read', auth(), NotificationController.markAsRead);

export const NotificationRoutes = router;
