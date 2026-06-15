import { io } from '../server';

io.on('connection', (socket) => {
  socket.on('send-message', (data) => {
    const { peerSocketId, message } = data;
    io.to(peerSocketId).emit('receive-message', { peerSocketId: socket.id, message, timestamp: new Date() });
  });

  socket.on('typing', (data) => {
    const { peerSocketId, isTyping } = data;
    io.to(peerSocketId).emit('typing', { peerSocketId: socket.id, isTyping });
  });
});
