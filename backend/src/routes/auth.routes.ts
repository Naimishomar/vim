import { Router } from 'express';
import { login, refresh } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login', login);
router.post('/refresh', refresh);
router.get('/me', requireAuth, (req, res) => {
  // @ts-ignore
  res.json({ user: req.user });
});

export default router;
