import { io } from '../server';
import { addToQueue, removeFromQueue } from '../redis/matchmaking';

io.on('connection', (socket) => {
  socket.on('search', async (data) => {
    const { userId, queueName = 'random-video-480', targetCountry, targetGender } = data;
    console.log(`User ${userId} started searching in ${queueName} with targetCountry ${targetCountry || 'global'} and targetGender ${targetGender || 'default'}`);
    await addToQueue(socket.id, userId, queueName, targetCountry, targetGender);
  });

  socket.on('cancel-search', async (data) => {
    const { queueName = 'random-video-480' } = data;
    console.log(`User ${socket.id} cancelled search`);
    await removeFromQueue(socket.id, queueName);
  });

  socket.on('skip', (data) => {
    const { peerSocketId } = data;
    io.to(peerSocketId).emit('partner-disconnected');
  });

  socket.on('disconnect', async () => {
    console.log('User disconnected:', socket.id);
    await removeFromQueue(socket.id, 'random-video-480');
    await removeFromQueue(socket.id, 'random-audio');
  });
});
