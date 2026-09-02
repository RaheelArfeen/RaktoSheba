import express, { Request, Response } from 'express';
import passport from '../../../config/passport';
import catchAsync from '../../utils/catchAsync';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const router = express.Router();

router.post(
  '/register',
  validateRequest(AuthValidation.registerValidationSchema),
  AuthController.register,
);

router.post('/login', validateRequest(AuthValidation.loginValidationSchema), AuthController.login);

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthController.refresh,
);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/api/auth/google/failed' }),
  catchAsync(async (req: Request, res: Response) => {
    const googleUser = req.user as unknown as { email: string; googleId: string };
    const result = await AuthService.loginOrRegisterWithGoogle(googleUser);

    res.status(200).json({
      success: true,
      message: 'Logged in with Google successfully',
      data: result,
    });
  }),
);

router.get('/google/failed', (req: Request, res: Response) => {
  res.status(401).json({ success: false, message: 'Google authentication failed' });
});

export const AuthRoutes = router;
