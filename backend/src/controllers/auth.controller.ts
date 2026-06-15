import { Request, Response } from 'express';
import User from '../models/User';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';

// Mocked Email OTP / Login for development
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    let user = await User.findOne({ email });
    if (!user) {
      // Auto-register for mocked flow
      const username = email.split('@')[0] + Math.floor(Math.random() * 1000);
      user = new User({
        name: email.split('@')[0],
        username,
        email,
      });
      await user.save();
    }

    const tokens = generateTokens(user._id as any);
    res.json({ user, ...tokens });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ error: 'Refresh token required' });
      return;
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    const tokens = generateTokens(user._id as any);
    res.json({ ...tokens });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};
