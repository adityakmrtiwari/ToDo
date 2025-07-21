import express from 'express';
import passport from 'passport';
import { googleAuth, googleCallback, getUser } from './controllers/authController.js';
import { jwtAuthMiddleware } from './middleware/jwtAuth.js';
import './config/passport.js';

const router = express.Router();

// Auth routes
router.get('/auth/google', googleAuth);
router.get('/auth/google/callback', googleCallback);
router.get('/auth/user', jwtAuthMiddleware, getUser);

export { router, jwtAuthMiddleware }; 