import { Router } from 'express';
import { redisClient } from '../server';

const router = Router();

// GET /api/settings
router.get('/', async (req, res) => {
  try {
    const guestAccessEnabled = await redisClient.get('appSettings:guestAccessEnabled');
    
    // If key doesn't exist, default to true
    if (guestAccessEnabled === null) {
      res.json({ guestAccessEnabled: true });
    } else {
      res.json({ guestAccessEnabled: guestAccessEnabled === 'true' });
    }
  } catch (error) {
    console.error('Error fetching settings:', error);
    // Fail open by default
    res.json({ guestAccessEnabled: true });
  }
});

export default router;
