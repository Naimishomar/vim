import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { Redis } from '@upstash/redis';
import { ENV } from './config/env';
import authRoutes from './routes/auth.routes';
import webrtcRoutes from './routes/webrtc.routes';
import chatRoutes from './routes/chat.routes';
import oauthRoutes from './routes/oauth.routes';
import uploadRoutes from './routes/upload.routes';
import passport from './config/passport';
import { startMediaCleanupJob } from './jobs/mediaCleanup';

const app = express();
const httpServer = createServer(app);

// Initialize Jobs
startMediaCleanupJob();

// CORS config
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());

import paymentRoutes from './routes/payment.routes';
import userRoutes from './routes/user.routes';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/webrtc', webrtcRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/oauth', oauthRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/users', userRoutes);

// ─── Serve Frontend in Production ───
import path from 'path';

if (process.env.NODE_ENV === 'production') {
  // In the Docker container, the frontend build will be at /app/frontend/dist
  // relative to the backend which runs from /app/backend/dist
  const frontendDistPath = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendDistPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// ─── Database Connection ───
export const connectDB = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// ─── Upstash Redis (HTTP REST — no connect() needed) ───
export const redisClient = new Redis({
  url: ENV.UPSTASH_REDIS_REST_URL,
  token: ENV.UPSTASH_REDIS_REST_TOKEN,
});

export const connectRedis = async () => {
  // Upstash is HTTP-based — no persistent TCP connection required.
  // We do a quick ping to confirm credentials are valid.
  try {
    await redisClient.ping();
    console.log('✅ Upstash Redis connected');
  } catch (err) {
    console.error('❌ Upstash Redis error:', err);
    process.exit(1);
  }
};

// ─── Socket.io ───
export const io = new Server(httpServer, {
  cors: corsOptions,
});

export { httpServer, app };
