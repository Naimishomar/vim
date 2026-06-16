import express from 'express';
import User from '../models/User';
import { requireAuth } from '../middlewares/auth.middleware';

const router = express.Router();

router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { gender, country } = req.body;
    
    const user = await User.findById((req as any).user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (gender) user.gender = gender;
    if (country) user.country = country;

    await user.save();

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Endpoint to fetch current user profile
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById((req as any).user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

export default router;
