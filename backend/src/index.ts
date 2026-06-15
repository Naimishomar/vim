import { httpServer, connectDB, connectRedis } from './server';
import { ENV } from './config/env';

// Import socket handlers
import './socket/matchmaking';
import './socket/webrtc';
import './socket/chat';

const start = async () => {
  await connectDB();
  await connectRedis();

  httpServer.listen(ENV.PORT, () => {
    console.log(`Server is running on port ${ENV.PORT}`);
  });
};

start();
