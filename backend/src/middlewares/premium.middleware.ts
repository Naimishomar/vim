import { Request, Response, NextFunction } from 'express';

export const requirePremium = (req: Request, res: Response, next: NextFunction): void => {
  // @ts-ignore
  const user = req.user;
  if (!user || !user.premiumStatus) {
    res.status(403).json({ error: 'Premium subscription required' });
    return;
  }
  next();
};
