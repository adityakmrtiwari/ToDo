//server.js

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import taskRoutes from './routes/taskRoute.js';
import { router as authRouter, ensureAuth } from './auth.js';
import MongoStore from 'connect-mongo';

dotenv.config(); // Load environment variables

// Validate required environment variables
const requiredEnv = [
  'MONGO_URI',
  'SESSION_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_CALLBACK_URL',
  'FRONTEND_URL',
];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

const app = express();
const PORT = process.env.PORT || 5000;

const isProduction = process.env.NODE_ENV === 'production';

const allowedOrigins = isProduction
  ? [process.env.FRONTEND_URL]
  : [
      'http://localhost:3000',
      'http://localhost:5000',
    ];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
    }),
    cookie: {
      secure: isProduction, // true in production, false in dev
      sameSite: isProduction ? 'none' : 'lax', // 'none' for prod, 'lax' for dev
      // maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Auth routes
app.use(authRouter);

// Protect the /tasks route
app.use('/tasks', ensureAuth, taskRoutes);

// Global error handler for uncaught errors
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
