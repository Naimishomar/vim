"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const webrtc_controller_1 = require("../controllers/webrtc.controller");
const router = (0, express_1.Router)();
// Retrieve Cloudflare Realtime session token
router.post('/sessions/new', webrtc_controller_1.createCloudflareSession);
router.post('/sessions/:sessionId/tracks/new', webrtc_controller_1.createCloudflareTrack);
exports.default = router;
//# sourceMappingURL=webrtc.routes.js.map