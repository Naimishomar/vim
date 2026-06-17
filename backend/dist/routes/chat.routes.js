"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const server_1 = require("../server");
const router = (0, express_1.Router)();
// GET /api/chat/online - Fetch all online users
router.get('/online', async (req, res) => {
    try {
        const rawUsers = await server_1.redisClient.hvals('online:users');
        // Upstash sometimes returns parsed JSON directly. Let's ensure everything is parsed.
        const onlineUsers = rawUsers.map((user) => {
            if (typeof user === 'string') {
                try {
                    return JSON.parse(user);
                }
                catch (e) {
                    return user;
                }
            }
            return user;
        });
        res.json({ onlineUsers });
    }
    catch (error) {
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
        const rawMessages = await server_1.redisClient.lrange(conversationKey, 0, -1);
        const messages = rawMessages.map(msg => {
            if (typeof msg === 'string') {
                try {
                    return JSON.parse(msg);
                }
                catch (e) {
                    return msg;
                }
            }
            return msg;
        });
        // Messages are LPUSHed, so index 0 is the newest. We want chronological order (oldest first)
        res.json({ messages: messages.reverse() });
    }
    catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
});
// DELETE /api/chat/history/:userId/:peerId - Clear chat history between two users
router.delete('/history/:userId/:peerId', async (req, res) => {
    try {
        const { userId, peerId } = req.params;
        const conversationKey = `chat:${[userId, peerId].sort().join(':')}`;
        await server_1.redisClient.del(conversationKey);
        res.json({ success: true, message: 'Chat history cleared' });
    }
    catch (error) {
        console.error('Error deleting chat history:', error);
        res.status(500).json({ error: 'Failed to clear chat history' });
    }
});
exports.default = router;
//# sourceMappingURL=chat.routes.js.map