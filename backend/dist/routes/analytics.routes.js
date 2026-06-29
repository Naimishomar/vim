"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const server_1 = require("../server");
const router = (0, express_1.Router)();
// POST /api/analytics/visit
router.post('/visit', async (req, res) => {
    try {
        const { visitorId } = req.body;
        if (!visitorId) {
            return res.status(400).json({ error: 'visitorId is required' });
        }
        const today = new Date().toISOString().split('T')[0];
        const key = `visits:${today}`;
        // HyperLogLog add (O(1) time complexity, very memory efficient)
        await server_1.redisClient.pfadd(key, visitorId);
        // Set expiry to 7 days to clean up old keys automatically
        // Using a pipeline or checking if TTL is -1 would be better, but for simplicity:
        await server_1.redisClient.expire(key, 7 * 24 * 60 * 60);
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error tracking visit:', error);
        // Don't fail the client request if analytics fails
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
//# sourceMappingURL=analytics.routes.js.map