import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
      },
      (accessToken, refreshToken, profile, done) => {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error('Google account has no public email'));
        }

        return done(null, { email, googleId: profile.id } as unknown as Express.User);
      },
    ),
  );
}

export default passport;
