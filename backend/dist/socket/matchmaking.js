"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../server");
const matchmaking_1 = require("../redis/matchmaking");
server_1.io.on('connection', (socket) => {
    socket.on('search', async (data) => {
        const { userId, queueName = 'random-video-480', targetCountry, targetGender } = data;
        console.log(`User ${userId} started searching in ${queueName} with targetCountry ${targetCountry || 'global'} and targetGender ${targetGender || 'default'}`);
        await (0, matchmaking_1.addToQueue)(socket.id, userId, queueName, targetCountry, targetGender);
    });
    socket.on('cancel-search', async (data) => {
        const { queueName = 'random-video-480' } = data;
        console.log(`User ${socket.id} cancelled search`);
        await (0, matchmaking_1.removeFromQueue)(socket.id, queueName);
    });
    socket.on('skip', (data) => {
        const { peerSocketId } = data;
        server_1.io.to(peerSocketId).emit('partner-disconnected');
    });
    socket.on('disconnect', async () => {
        console.log('User disconnected:', socket.id);
        await (0, matchmaking_1.removeFromQueue)(socket.id, 'random-video-480');
        await (0, matchmaking_1.removeFromQueue)(socket.id, 'random-audio');
    });
});
//# sourceMappingURL=matchmaking.js.map