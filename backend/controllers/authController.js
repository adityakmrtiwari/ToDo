import passport from 'passport';
import jwt from 'jsonwebtoken';

// Start Google OAuth
export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'], session: false });

// Google OAuth callback
export const googleCallback = [
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  (req, res) => {
    const user = req.user;
    const payload = {
      id: user.id,
      displayName: user.displayName,
      emails: user.emails,
      photos: user.photos,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  }
];

// Return user info from JWT
export const getUser = (req, res) => {
  res.json({ user: req.user });
}; 