import { Router } from 'express';
import { getCloudflareSession } from '../controllers/webrtc.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Retrieve Cloudflare Realtime session token
router.get('/session', getCloudflareSession); // Open for development mockup

export default router;
