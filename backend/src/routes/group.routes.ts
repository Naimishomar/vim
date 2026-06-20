import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import Group from '../models/Group';
import { redisClient, io } from '../server';

const router = Router();

// GET /api/groups - Fetch all groups
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find().sort({ createdAt: -1 });
    res.json({ groups });
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

// GET /api/groups/:roomId - Fetch single group
router.get('/:roomId', async (req, res) => {
  try {
    const group = await Group.findOne({ roomId: req.params.roomId });
    if (!group) return res.status(404).json({ error: 'Group not found' });
    res.json({ group });
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({ error: 'Failed to fetch group' });
  }
});

// POST /api/groups - Create a group
router.post('/', requireAuth, async (req: any, res: any) => {
  try {
    const { name, description, photo } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    // Generate random room ID
    const roomId = 'VIBE-' + Math.random().toString(36).substring(2, 6).toUpperCase();

    const newGroup = new Group({
      roomId,
      name,
      description,
      photo,
      adminId: req.user.id,
    });

    await newGroup.save();
    res.json({ group: newGroup });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Failed to create group' });
  }
});

// PUT /api/groups/:roomId - Update group (admin only)
router.put('/:roomId', requireAuth, async (req: any, res: any) => {
  try {
    const { name, description, photo } = req.body;
    const group = await Group.findOne({ roomId: req.params.roomId });
    
    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (group.adminId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to edit this group' });
    }

    group.name = name ?? group.name;
    group.description = description ?? group.description;
    group.photo = photo ?? group.photo;

    await group.save();
    res.json({ group });
  } catch (error) {
    console.error('Error updating group:', error);
    res.status(500).json({ error: 'Failed to update group' });
  }
});

// DELETE /api/groups/:roomId - Delete group (admin only)
router.delete('/:roomId', requireAuth, async (req: any, res: any) => {
  try {
    const { roomId } = req.params;
    const group = await Group.findOne({ roomId });
    
    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (group.adminId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to delete this group' });
    }

    // Delete from DB
    await Group.deleteOne({ roomId });

    // Clean up Redis messages
    await redisClient.del(`group:msgs:${roomId}`);

    // Broadcast to users in the room to kick them
    io.to(`group:${roomId}`).emit('group-deleted', { roomId });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).json({ error: 'Failed to delete group' });
  }
});

export default router;
