import express from 'express';
import User from '../models/User';
import { requireAuth } from '../middlewares/auth.middleware';
import Report from '../models/Report';

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

// Endpoint to report a user
router.post('/report', requireAuth, async (req, res) => {
  try {
    const { reportedUserId, reason } = req.body;
    const reporterId = (req as any).user.id;

    if (!reportedUserId) {
      return res.status(400).json({ error: 'Reported user ID is required' });
    }

    const report = new Report({
      reporter: reporterId,
      reportedUser: reportedUserId,
      reason: reason || 'Inappropriate behavior'
    });

    await report.save();
    res.json({ success: true, message: 'User reported successfully' });
  } catch (error) {
    console.error('Error reporting user:', error);
    res.status(500).json({ error: 'Failed to report user' });
  }
});

export default router;
