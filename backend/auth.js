import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// User serialization (for session)
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Validate required Google OAuth env variables
['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_CALLBACK_URL'].forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

// Passport Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      // Here you can save/find user in DB if needed
      console.log('Google OAuth profile:', profile);
      return done(null, profile);
    }
  )
);

// Auth routes
router.get(
  '/auth/google',
  (req, res, next) => {
    console.log('Starting Google OAuth login');
    next();
  },
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/auth/google/callback',
  (req, res, next) => {
    console.log('Google OAuth callback received');
    next();
  },
  passport.authenticate('google', {
    failureRedirect: '/',
    session: true,
  }),
  (req, res) => {
    // Redirect to frontend after successful login
    const redirectUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    console.log('Login successful, redirecting to frontend:', redirectUrl);
    res.redirect(redirectUrl);
  }
);

// Add this error handler after your routes:
router.use((err, req, res, next) => {
  console.error('AUTH ERROR:', err);
  res.status(500).send('Authentication error');
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).send('Logout error');
    }
    const redirectUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    console.log('User logged out, redirecting to frontend:', redirectUrl);
    res.redirect(redirectUrl);
  });
});

// Add this route to return the authenticated user's info
router.get('/auth/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.json({ user: null });
  }
});

// Middleware to check authentication
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  console.warn('Unauthorized access attempt');
  res.status(401).json({ message: 'Unauthorized' });
}

export { router, ensureAuth }; 