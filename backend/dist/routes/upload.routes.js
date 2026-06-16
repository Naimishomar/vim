"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const r2_service_1 = require("../services/r2.service");
const User_1 = __importDefault(require("../models/User"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const server_1 = require("../server");
const router = (0, express_1.Router)();
// Multer memory storage config (max 10MB)
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type. Only images and videos are allowed.'));
        }
    },
});
// Profile Photo Upload (Persistent)
router.post('/profile', auth_middleware_1.requireAuth, upload.single('file'), async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).json({ error: 'No file provided' });
        const result = await (0, r2_service_1.uploadToR2)(req.file, 'profiles');
        // Update user document
        await User_1.default.findByIdAndUpdate(req.user.id, { profileImage: result.url });
        res.json({ url: result.url });
    }
    catch (error) {
        console.error('[Upload Profile]', error);
        res.status(500).json({ error: 'Failed to upload profile photo' });
    }
});
// Ephemeral Chat/Call Attachment Upload (Auto-deleted on fixed 6-hour schedule)
router.post('/ephemeral', auth_middleware_1.requireAuth, upload.single('file'), async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).json({ error: 'No file provided' });
        const result = await (0, r2_service_1.uploadToR2)(req.file, 'ephemeral');
        // Add to a global Redis Set for the cron job to sweep
        await server_1.redisClient.sadd('ephemeral:media:batch', result.s3Key);
        res.json({ url: result.url });
    }
    catch (error) {
        console.error('[Upload Ephemeral]', error);
        res.status(500).json({ error: error.message || 'Failed to upload file' });
    }
});
exports.default = router;
//# sourceMappingURL=upload.routes.js.map