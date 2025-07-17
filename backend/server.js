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

const app = express();
const PORT = process.env.PORT || 5000;

const isProduction = process.env.NODE_ENV === 'production';

const allowedOrigins = isProduction
  ? ['https://to-do-omega-bay.vercel.app']
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
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions'
    }),
    cookie: {
      secure: isProduction, // true in production (HTTPS)
      sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-site cookies in production
      // maxAge: 24 * 60 * 60 * 1000, // 1 day (optional)
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    // useNewUrlParser and useUnifiedTopology are not needed in Mongoose 6+
  })
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Auth routes
app.use(authRouter);

// Protect the /tasks route
app.use('/tasks', ensureAuth, taskRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
