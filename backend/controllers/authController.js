import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

// Start Google OAuth
export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'], session: false });

// Google OAuth callback
export const googleCallback = [
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  async (req, res) => {
    try {
      const profile = req.user;
      const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

      if (!email) {
        return res.status(400).json({ message: 'Google account has no email associated.' });
      }

      // Find user by email
      let user = await User.findOne({ email });

      if (!user) {
        // Create new user if not found
        user = new User({
          email,
          googleId: profile.id,
          displayName: profile.displayName,
          photos: profile.photos,
        });
        await user.save();
      } else if (!user.googleId) {
        // Link Google ID to existing username/password account
        user.googleId = profile.id;
        user.displayName = user.displayName || profile.displayName;
        if (!user.photos || user.photos.length === 0) {
          user.photos = profile.photos;
        }
        await user.save();
      }

      // JWT payload uses MongoDB user ID
      const payload = {
        id: user._id, // Use ObjectId now
        email: user.email,
        username: user.username,
        displayName: user.displayName,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
    } catch (err) {
      console.error(err);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
  }
];

// Register custom user
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide username, email, and password' });
    }

    if (password.length < 4) {
      return res.status(400).json({ message: 'Password must be at least 4 characters long' });
    }

    // Check if user exists by email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with that email or username already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    // Create JWT
    const payload = {
      id: user._id,
      email: user.email,
      username: user.username,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: payload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login custom user
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password' });
    }

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user has a password (they might have registered via Google only)
    if (!user.password) {
      return res.status(401).json({ message: 'Please login using Google' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT
    const payload = {
      id: user._id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: payload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Return user info from JWT
export const getUser = (req, res) => {
  res.json({ user: req.user });
};