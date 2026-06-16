"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../server");
async function seed() {
    const mockUser1 = {
        socketId: 'mock1',
        userId: 'mockuser_111',
        name: 'Alice Fake',
        username: 'alice_fake',
        profileImage: 'https://i.pravatar.cc/150?u=alice'
    };
    const mockUser2 = {
        socketId: 'mock2',
        userId: 'mockuser_222',
        name: 'Bob Fake',
        username: 'bob_fake',
        profileImage: 'https://i.pravatar.cc/150?u=bob'
    };
    await server_1.redisClient.hset('online:users', { mock1: JSON.stringify(mockUser1) });
    await server_1.redisClient.hset('online:users', { mock2: JSON.stringify(mockUser2) });
    console.log('Mock users added to Redis!');
    process.exit(0);
}
seed();
//# sourceMappingURL=mockUsers.js.map