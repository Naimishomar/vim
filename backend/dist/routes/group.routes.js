"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const Group_1 = __importDefault(require("../models/Group"));
const server_1 = require("../server");
const router = (0, express_1.Router)();
// GET /api/groups - Fetch all groups
router.get('/', auth_middleware_1.requireAuth, async (req, res) => {
    try {
        const groups = await Group_1.default.find({
            $or: [{ isPublic: true }, { adminId: req.user.id }]
        }).sort({ createdAt: -1 });
        res.json({ groups });
    }
    catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ error: 'Failed to fetch groups' });
    }
});
// GET /api/groups/:roomId - Fetch single group
router.get('/:roomId', async (req, res) => {
    try {
        const group = await Group_1.default.findOne({ roomId: req.params.roomId });
        if (!group)
            return res.status(404).json({ error: 'Group not found' });
        res.json({ group });
    }
    catch (error) {
        console.error('Error fetching group:', error);
        res.status(500).json({ error: 'Failed to fetch group' });
    }
});
// POST /api/groups - Create a group
router.post('/', auth_middleware_1.requireAuth, async (req, res) => {
    try {
        const { name, description, photo, isPublic } = req.body;
        if (!name)
            return res.status(400).json({ error: 'Name is required' });
        // Generate random room ID
        const roomId = 'VIBE-' + Math.random().toString(36).substring(2, 6).toUpperCase();
        const newGroup = new Group_1.default({
            roomId,
            name,
            description,
            photo,
            isPublic: isPublic ?? true,
            adminId: req.user.id,
        });
        await newGroup.save();
        res.json({ group: newGroup });
    }
    catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ error: 'Failed to create group' });
    }
});
// PUT /api/groups/:roomId - Update group (admin only)
router.put('/:roomId', auth_middleware_1.requireAuth, async (req, res) => {
    try {
        const { name, description, photo, isPublic } = req.body;
        const group = await Group_1.default.findOne({ roomId: req.params.roomId });
        if (!group)
            return res.status(404).json({ error: 'Group not found' });
        if (group.adminId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to edit this group' });
        }
        group.name = name ?? group.name;
        group.description = description ?? group.description;
        group.photo = photo ?? group.photo;
        if (isPublic !== undefined)
            group.isPublic = isPublic;
        await group.save();
        res.json({ group });
    }
    catch (error) {
        console.error('Error updating group:', error);
        res.status(500).json({ error: 'Failed to update group' });
    }
});
// DELETE /api/groups/:roomId - Delete group (admin only)
router.delete('/:roomId', auth_middleware_1.requireAuth, async (req, res) => {
    try {
        const { roomId } = req.params;
        const group = await Group_1.default.findOne({ roomId });
        if (!group)
            return res.status(404).json({ error: 'Group not found' });
        if (group.adminId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to delete this group' });
        }
        // Delete from DB
        await Group_1.default.deleteOne({ roomId });
        // Clean up Redis messages
        await server_1.redisClient.del(`group:msgs:${roomId}`);
        // Broadcast to users in the room to kick them
        server_1.io.to(`group:${roomId}`).emit('group-deleted', { roomId });
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error deleting group:', error);
        res.status(500).json({ error: 'Failed to delete group' });
    }
});
exports.default = router;
//# sourceMappingURL=group.routes.js.map