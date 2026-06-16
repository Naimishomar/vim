import { Server } from 'socket.io';
import { Redis } from '@upstash/redis';
declare const app: import("express-serve-static-core").Express;
declare const httpServer: import("node:http").Server<typeof import("node:http").IncomingMessage, typeof import("node:http").ServerResponse>;
export declare const connectDB: () => Promise<void>;
export declare const redisClient: Redis;
export declare const connectRedis: () => Promise<void>;
export declare const io: Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export { httpServer, app };
//# sourceMappingURL=server.d.ts.map