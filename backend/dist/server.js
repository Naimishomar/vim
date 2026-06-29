"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.httpServer = exports.io = exports.connectRedis = exports.redisClient = exports.connectDB = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const mongoose_1 = __importDefault(require("mongoose"));
const redis_1 = require("@upstash/redis");
const env_1 = require("./config/env");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const webrtc_routes_1 = __importDefault(require("./routes/webrtc.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const oauth_routes_1 = __importDefault(require("./routes/oauth.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const group_routes_1 = __importDefault(require("./routes/group.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const blog_routes_1 = __importDefault(require("./routes/blog.routes"));
const sitemap_routes_1 = __importDefault(require("./routes/sitemap.routes"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const settings_routes_1 = __importDefault(require("./routes/settings.routes"));
const passport_1 = __importDefault(require("./config/passport"));
const app = (0, express_1.default)();
exports.app = app;
const httpServer = (0, http_1.createServer)(app);
exports.httpServer = httpServer;
// CORS config
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};
// Compression middleware (compresses API responses for slow networks)
app.use((0, compression_1.default)());
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/webrtc', webrtc_routes_1.default);
app.use('/api/payment', payment_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/oauth', oauth_routes_1.default);
app.use('/api/upload', upload_routes_1.default);
app.use('/api/chat', chat_routes_1.default);
app.use('/api/groups', group_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/blogs', blog_routes_1.default);
app.use('/api/analytics', analytics_routes_1.default);
app.use('/api/settings', settings_routes_1.default);
app.use('/sitemap.xml', sitemap_routes_1.default);
app.get("/", (req, res) => {
    res.send("Vibe server never gets down🚀🚀");
});
// ─── Database Connection ───
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(env_1.ENV.MONGO_URI);
        console.log('✅ MongoDB connected');
    }
    catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
// ─── Upstash Redis (HTTP REST — no connect() needed) ───
exports.redisClient = new redis_1.Redis({
    url: env_1.ENV.UPSTASH_REDIS_REST_URL,
    token: env_1.ENV.UPSTASH_REDIS_REST_TOKEN,
});
const connectRedis = async () => {
    // Upstash is HTTP-based — no persistent TCP connection required.
    // We do a quick ping to confirm credentials are valid.
    try {
        await exports.redisClient.ping();
        console.log('✅ Upstash Redis connected');
    }
    catch (err) {
        console.error('❌ Upstash Redis error:', err);
        process.exit(1);
    }
};
exports.connectRedis = connectRedis;
// ─── Socket.io ───
exports.io = new socket_io_1.Server(httpServer, {
    cors: corsOptions,
});
//# sourceMappingURL=server.js.map