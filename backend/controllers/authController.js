import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Add this import

// Start Google OAuth
export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'], session: false });

// Google OAuth callback
export const googleCallback = [
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  async (req, res) => {
    const profile = req.user;
    // Find or create user in MongoDB
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = new User({
        googleId: profile.id,
        displayName: profile.displayName,
        emails: profile.emails,
        photos: profile.photos,
      });
      await user.save();
    } else {
      // Optionally update user info on each login
      user.displayName = profile.displayName;
      user.emails = profile.emails;
      user.photos = profile.photos;
      await user.save();
    }
    // JWT payload uses MongoDB user
    const payload = {
      id: user.googleId,
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