import { redisClient, io } from '../server';
import { v4 as uuidv4 } from 'uuid';
import Session from '../models/Session';
import User from '../models/User';

export const addToQueue = async (socketId: string, userId: string, baseQueueName: string, targetCountry?: string, targetGender?: string, previousPeerSocketId?: string): Promise<void> => {
  let userGender = 'unspecified';
  let isPremium = false;
  let myCountry = 'unspecified';

  if (!userId.startsWith('guest-')) {
    const user = await User.findById(userId);
    if (user) {
      userGender = user.gender || 'unspecified';
      isPremium = user.premiumStatus || false;
      myCountry = user.country || 'unspecified';
    }
  }

  // Determine which queues to check based on gender and premium status
  const oppositeGender = userGender === 'male' ? 'female' : 'male';
  let queuesToCheck: string[] = [];

  if (isPremium && targetGender) {
    if (targetGender === 'opposite' && userGender !== 'unspecified') {
      queuesToCheck = [`${baseQueueName}:${oppositeGender}`];
    } else if (targetGender === 'same' && userGender !== 'unspecified') {
      queuesToCheck = [`${baseQueueName}:${userGender}`];
    } else {
      // random gender or unspecified user gender
      queuesToCheck = [`${baseQueueName}:male`, `${baseQueueName}:female`, `${baseQueueName}:unspecified`].sort(() => Math.random() - 0.5);
    }
  } else if (isPremium && userGender !== 'unspecified') {
    // Default Premium users with defined gender to ONLY want opposite gender
    queuesToCheck = [`${baseQueueName}:${oppositeGender}`];
  } else {
    // Free users or unspecified gender
    if (userGender !== 'unspecified') {
      // 80% of the time, free users won't even check the opposite gender queue.
      // If they do check it, we put same gender first to minimize opposite gender matches.
      const shouldCheckOpposite = Math.random() < 0.2; 
      
      if (shouldCheckOpposite) {
        queuesToCheck = [`${baseQueueName}:${userGender}`, `${baseQueueName}:unspecified`, `${baseQueueName}:${oppositeGender}`];
      } else {
        queuesToCheck = [`${baseQueueName}:${userGender}`, `${baseQueueName}:unspecified`];
      }
    } else {
      queuesToCheck = [`${baseQueueName}:male`, `${baseQueueName}:female`, `${baseQueueName}:unspecified`];
    }
  }

  let peerData: { socketId: string; userId: string; country?: string } | null = null;
  let matchedQueue = '';

  for (const q of queuesToCheck) {
    if (isPremium && targetCountry) {
      // If targetCountry is specified, find the first user from that country
      const list = await redisClient.lrange<{ socketId: string; userId: string; country?: string }>(q, 0, -1);
      const matches = list.filter(u => u && u.country?.toLowerCase() === targetCountry.toLowerCase());
      for (const match of matches) {
        if (match && match.socketId !== previousPeerSocketId && match.socketId !== socketId) {
          const removedCount = await redisClient.lrem(q, 1, match);
          if (removedCount > 0) {
            peerData = match;
            matchedQueue = q;
            break;
          }
        }
      }
      if (peerData) break;
    } else {
      // Find the first peer that is NOT ourselves and NOT the previous peer
      const list = await redisClient.lrange<{ socketId: string; userId: string; country?: string }>(q, 0, -1);
      const matches = list.filter(u => u && u.socketId !== socketId && u.socketId !== previousPeerSocketId && u.userId !== userId);
      for (const match of matches) {
        const removedCount = await redisClient.lrem(q, 1, match);
        if (removedCount > 0) {
          peerData = match;
          matchedQueue = q;
          break;
        }
      }
      if (peerData) break;
    }
  }

  if (peerData) {
    // Don't match with ourselves (same user ID or same socket connection)
    if (peerData.userId === userId || peerData.socketId === socketId || peerData.socketId === previousPeerSocketId) {
      // Discard this ghost and recursively try to find a real partner.
      return addToQueue(socketId, userId, baseQueueName, targetCountry, targetGender, previousPeerSocketId);
    }

    // Match found!
    console.log(`Match found between ${userId} and ${peerData.userId}!`);
    const roomId = uuidv4();
    const callType = baseQueueName.includes('audio') ? 'audio' : 'video';

    // Create session in DB
    try {
      const session = new Session({ roomId, user1: userId, user2: peerData.userId, callType });
      await session.save();
    } catch (e) {
      console.error('Failed to create session in DB', e);
    }

    // Fetch user details if they are not guests
    const user1Data = userId.startsWith('guest-') 
      ? { name: 'Guest', username: userId, profileImage: '', country: 'unspecified' } 
      : await User.findById(userId).select('name username profileImage premiumStatus country');
      
    const user2Data = peerData.userId.startsWith('guest-')
      ? { name: 'Guest', username: peerData.userId, profileImage: '', country: peerData.country || 'unspecified' }
      : await User.findById(peerData.userId).select('name username profileImage premiumStatus country');

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
    
    // Track active match so we can handle unexpected disconnects
    await redisClient.set(`activeMatch:${socketId}`, peerData.socketId);
    await redisClient.set(`activeMatch:${peerData.socketId}`, socketId);
  } else {
    // No one waiting — add self to queue
    const myQueue = `${baseQueueName}:${userGender}`;
    console.log(`No match found. User ${userId} is waiting in queue ${myQueue}.`);
    await redisClient.rpush(myQueue, { socketId, userId, country: myCountry });
  }
};

export const removeFromQueue = async (socketId: string, baseQueueName: string) => {
  const queues = [`${baseQueueName}:male`, `${baseQueueName}:female`, `${baseQueueName}:unspecified`];
  for (const q of queues) {
    const list = await redisClient.lrange<{ socketId: string }>(q, 0, -1);
    for (const data of list) {
      if (data && data.socketId === socketId) {
        await redisClient.lrem(q, 1, data);
        break;
      }
    }
  }
};
