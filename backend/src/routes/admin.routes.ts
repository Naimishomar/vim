import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware';
import User from '../models/User';

const router = Router();

// GET /api/admin/users
router.get('/users', requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password -__v').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users for admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
