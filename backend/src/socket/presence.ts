import { io, redisClient } from '../server';

export interface OnlineUser {
  socketId: string;
  userId: string;
  name: string;
  username: string;
  profileImage?: string;
  premiumStatus?: boolean;
}

io.on('connection', (socket) => {
  // Client explicitly identifies themselves (registered user or guest)
  socket.on('identify', async (userData: Omit<OnlineUser, 'socketId'>) => {
    try {
      const user: OnlineUser = { ...userData, socketId: socket.id };
      await redisClient.hset('online:users', { [socket.id]: JSON.stringify(user) });
      
      // Optionally broadcast that a new user came online
      io.emit('user-online', user);
    } catch (error) {
      console.error('Failed to set user online presence', error);
    }
  });

  socket.on('disconnect', async () => {
    try {
      // Broadcast disconnect before removing
      const rawUser = await redisClient.hget<string>('online:users', socket.id);
      if (rawUser) {
        let user: OnlineUser;
        // Upstash hget sometimes returns the parsed object if it was stored as JSON, 
        // or a string if it was stored as a stringified JSON.
        if (typeof rawUser === 'string') {
           user = JSON.parse(rawUser);
        } else {
           user = rawUser as unknown as OnlineUser;
        }
        io.emit('user-offline', user.userId);
      }
      
      await redisClient.hdel('online:users', socket.id);
    } catch (error) {
      console.error('Failed to remove user online presence', error);
    }
  });
});
