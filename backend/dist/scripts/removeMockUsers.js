"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../server");
async function removeMocks() {
    await server_1.redisClient.hdel('online:users', 'mock1');
    await server_1.redisClient.hdel('online:users', 'mock2');
    console.log('Mock users removed from Redis!');
    process.exit(0);
}
removeMocks();
//# sourceMappingURL=removeMockUsers.js.map