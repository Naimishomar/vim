import { Router } from 'express';
import { redisClient } from '../server';

const router = Router();

// GET /api/chat/online - Fetch all online users
router.get('/online', async (req, res) => {
  try {
    const rawUsers = await redisClient.hvals('online:users');
    
    // Upstash sometimes returns parsed JSON directly. Let's ensure everything is parsed.
    const onlineUsers = rawUsers.map((user: any) => {
      if (typeof user === 'string') {
        try { return JSON.parse(user); } catch (e) { return user; }
      }
      return user;
    });

    res.json({ onlineUsers });
  } catch (error) {
    console.error('Error fetching online users:', error);
    res.status(500).json({ error: 'Failed to fetch online users' });
  }
});

// GET /api/chat/history/:userId/:peerId - Fetch up to 25 latest messages
router.get('/history/:userId/:peerId', async (req, res) => {
  try {
    const { userId, peerId } = req.params;
    const conversationKey = `chat:${[userId, peerId].sort().join(':')}`;

    // Get all messages from the list (which is capped at 25 anyway)
    const rawMessages = await redisClient.lrange(conversationKey, 0, -1);
    
    const messages = rawMessages.map(msg => {
       if (typeof msg === 'string') {
           try { return JSON.parse(msg); } catch(e) { return msg; }
       }
       return msg;
    });

    // Messages are LPUSHed, so index 0 is the newest. We want chronological order (oldest first)
    res.json({ messages: messages.reverse() });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

export default router;
