import { redisClient, io } from '../server';
import { v4 as uuidv4 } from 'uuid';
import Session from '../models/Session';
import User from '../models/User';

export const addToQueue = async (socketId: string, userId: string, queueName: string) => {
  // Pop the next waiting user from the queue (Upstash uses lowercase method names)
  const peerIdStr = await redisClient.lpop<string>(queueName);

  if (peerIdStr) {
    const peerData = JSON.parse(peerIdStr) as { socketId: string; userId: string };

    // Don't match with ourselves
    if (peerData.userId === userId) {
      await redisClient.rpush(queueName, JSON.stringify({ socketId, userId }));
      return;
    }

    // Match found!
    const roomId = uuidv4();
    const callType = queueName.includes('audio') ? 'audio' : 'video';

    // Create session in DB
    try {
      const session = new Session({ roomId, user1: userId, user2: peerData.userId, callType });
      await session.save();
    } catch (e) {
      console.error('Failed to create session in DB', e);
    }

    // Fetch user details
    const user1Data = await User.findById(userId).select('name username profileImage');
    const user2Data = await User.findById(peerData.userId).select('name username profileImage');

    io.to(socketId).emit('match-found', {
      roomId,
      peerSocketId: peerData.socketId,
      peerData: user2Data,
      isInitiator: true,
    });
    io.to(peerData.socketId).emit('match-found', {
      roomId,
      peerSocketId: socketId,
      peerData: user1Data,
      isInitiator: false,
    });
  } else {
    // No one waiting — add self to queue
    await redisClient.rpush(queueName, JSON.stringify({ socketId, userId }));
  }
};

export const removeFromQueue = async (socketId: string, queueName: string) => {
  const list = await redisClient.lrange<string>(queueName, 0, -1);
  for (const item of list) {
    const data = JSON.parse(item) as { socketId: string };
    if (data.socketId === socketId) {
      await redisClient.lrem(queueName, 1, item);
      break;
    }
  }
};
