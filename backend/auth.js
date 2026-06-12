import express from 'express';
import passport from 'passport';
import { googleAuth, googleCallback, getUser, register, login } from './controllers/authController.js';
import { jwtAuthMiddleware } from './middleware/jwtAuth.js';
import './config/passport.js';

const router = express.Router();

// Google Auth routes
router.get('/auth/google', googleAuth);
router.get('/auth/google/callback', googleCallback);

// Custom Auth routes
router.post('/auth/register', register);
router.post('/auth/login', login);

// Get current user
router.get('/auth/user', jwtAuthMiddleware, getUser);

export { router, jwtAuthMiddleware };