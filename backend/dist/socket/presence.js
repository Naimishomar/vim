"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../server");
server_1.io.on('connection', (socket) => {
    // Client explicitly identifies themselves (registered user or guest)
    socket.on('identify', async (userData) => {
        try {
            const user = { ...userData, socketId: socket.id };
            await server_1.redisClient.hset('online:users', { [socket.id]: JSON.stringify(user) });
            // Optionally broadcast that a new user came online
            server_1.io.emit('user-online', user);
        }
        catch (error) {
            console.error('Failed to set user online presence', error);
        }
    });
    socket.on('disconnect', async () => {
        try {
            // Broadcast disconnect before removing
            const rawUser = await server_1.redisClient.hget('online:users', socket.id);
            if (rawUser) {
                let user;
                // Upstash hget sometimes returns the parsed object if it was stored as JSON, 
                // or a string if it was stored as a stringified JSON.
                if (typeof rawUser === 'string') {
                    user = JSON.parse(rawUser);
                }
                else {
                    user = rawUser;
                }
                server_1.io.emit('user-offline', user.userId);
            }
            await server_1.redisClient.hdel('online:users', socket.id);
        }
        catch (error) {
            console.error('Failed to remove user online presence', error);
        }
    });
});
//# sourceMappingURL=presence.js.map