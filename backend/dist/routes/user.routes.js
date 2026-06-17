"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const Report_1 = __importDefault(require("../models/Report"));
const router = express_1.default.Router();
router.put('/profile', auth_middleware_1.requireAuth, async (req, res) => {
    try {
        const { gender, country } = req.body;
        const user = await User_1.default.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (gender)
            user.gender = gender;
        if (country)
            user.country = country;
        await user.save();
        res.json({ success: true, user });
    }
    catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});
// Endpoint to fetch current user profile
router.get('/me', auth_middleware_1.requireAuth, async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ success: true, user });
    }
    catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});
// Endpoint to report a user
router.post('/report', auth_middleware_1.requireAuth, async (req, res) => {
    try {
        const { reportedUserId, reason } = req.body;
        const reporterId = req.user.id;
        if (!reportedUserId) {
            return res.status(400).json({ error: 'Reported user ID is required' });
        }
        const report = new Report_1.default({
            reporter: reporterId,
            reportedUser: reportedUserId,
            reason: reason || 'Inappropriate behavior'
        });
        await report.save();
        res.json({ success: true, message: 'User reported successfully' });
    }
    catch (error) {
        console.error('Error reporting user:', error);
        res.status(500).json({ error: 'Failed to report user' });
    }
});
exports.default = router;
//# sourceMappingURL=user.routes.js.map