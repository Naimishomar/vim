"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../server");
server_1.io.on('connection', (socket) => {
    socket.on('join-group', async (data) => {
        const { roomId, user } = data;
        if (!roomId)
            return;
        // Leave other group rooms
        socket.rooms.forEach(room => {
            if (room.startsWith('group:') && room !== `group:${roomId}`) {
                socket.leave(room);
                const size = (server_1.io.sockets.adapter.rooms.get(room)?.size || 1) - 1;
                server_1.io.to(room).emit('group-count-update', { count: size });
            }
        });
        socket.join(`group:${roomId}`);
        const size = server_1.io.sockets.adapter.rooms.get(`group:${roomId}`)?.size || 0;
        server_1.io.to(`group:${roomId}`).emit('group-count-update', { count: size });
        // Send history
        try {
            const rawMessages = await server_1.redisClient.lrange(`group:msgs:${roomId}`, 0, 199);
            const messages = rawMessages.map(m => typeof m === 'string' ? JSON.parse(m) : m).reverse();
            socket.emit('group-history', { messages });
        }
        catch (e) {
            console.error('Failed to fetch group history', e);
        }
    });
    socket.on('group-message', async (data) => {
        const { roomId, message, user } = data;
        if (!roomId || !message || !user)
            return;
        const msgObj = {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
            user: {
                _id: user._id,
                name: user.name,
                username: user.username,
                profileImage: user.profileImage
            },
            text: message,
            timestamp: new Date().toISOString()
        };
        server_1.io.to(`group:${roomId}`).emit('new-group-message', msgObj);
        try {
            await server_1.redisClient.lpush(`group:msgs:${roomId}`, JSON.stringify(msgObj));
            await server_1.redisClient.ltrim(`group:msgs:${roomId}`, 0, 199);
        }
        catch (e) {
            console.error('Failed to save group message', e);
        }
    });
    socket.on('group-reaction', (data) => {
        const { roomId, emoji } = data;
        if (!roomId || !emoji)
            return;
        // Volatile broadcast: No DB/Redis cost. Fire and forget!
        server_1.io.to(`group:${roomId}`).emit('new-group-reaction', { emoji, id: Date.now() + Math.random() });
    });
    socket.on('leave-group', (data) => {
        const { roomId } = data;
        if (!roomId)
            return;
        socket.leave(`group:${roomId}`);
        const size = server_1.io.sockets.adapter.rooms.get(`group:${roomId}`)?.size || 0;
        server_1.io.to(`group:${roomId}`).emit('group-count-update', { count: size });
    });
    socket.on('disconnecting', () => {
        socket.rooms.forEach(room => {
            if (room.startsWith('group:')) {
                const size = (server_1.io.sockets.adapter.rooms.get(room)?.size || 1) - 1;
                server_1.io.to(room).emit('group-count-update', { count: size });
            }
        });
    });
});
//# sourceMappingURL=groupChat.js.map