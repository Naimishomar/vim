"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../server");
const matchmaking_1 = require("../redis/matchmaking");
server_1.io.on('connection', (socket) => {
    socket.on('search', async (data) => {
        const { userId, queueName = 'random-video-480', targetCountry, targetGender, previousPeerSocketId } = data;
        console.log(`User ${userId} started searching in ${queueName} with targetCountry ${targetCountry || 'global'} and targetGender ${targetGender || 'default'}`);
        await (0, matchmaking_1.removeFromQueue)(socket.id, queueName);
        await (0, matchmaking_1.addToQueue)(socket.id, userId, queueName, targetCountry, targetGender, previousPeerSocketId);
    });
    socket.on('cancel-search', async (data) => {
        const { queueName = 'random-video-480' } = data;
        console.log(`User ${socket.id} cancelled search`);
        await (0, matchmaking_1.removeFromQueue)(socket.id, queueName);
    });
    socket.on('skip', async (data) => {
        const { peerSocketId } = data;
        server_1.io.to(peerSocketId).emit('partner-disconnected');
        const { redisClient } = require('../server');
        await redisClient.del(`activeMatch:${socket.id}`);
        await redisClient.del(`activeMatch:${peerSocketId}`);
    });
    socket.on('disconnect', async () => {
        console.log('User disconnected:', socket.id);
        const { redisClient } = require('../server');
        const peerSocketId = await redisClient.get(`activeMatch:${socket.id}`);
        if (peerSocketId) {
            server_1.io.to(peerSocketId).emit('partner-disconnected');
            await redisClient.del(`activeMatch:${socket.id}`);
            await redisClient.del(`activeMatch:${peerSocketId}`);
        }
        await (0, matchmaking_1.removeFromQueue)(socket.id, 'random-video-480');
        await (0, matchmaking_1.removeFromQueue)(socket.id, 'random-audio');
        await (0, matchmaking_1.removeFromQueue)(socket.id, 'random-video-480-v2');
        await (0, matchmaking_1.removeFromQueue)(socket.id, 'random-audio-v2');
    });
});
//# sourceMappingURL=matchmaking.js.map