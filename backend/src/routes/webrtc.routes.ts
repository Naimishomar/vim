import { Router } from 'express';
import { createCloudflareSession, createCloudflareTrack } from '../controllers/webrtc.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Retrieve Cloudflare Realtime session token
router.post('/sessions/new', createCloudflareSession);
router.post('/sessions/:sessionId/tracks/new', createCloudflareTrack);

export default router;
