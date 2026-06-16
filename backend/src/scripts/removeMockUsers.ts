import { redisClient } from '../server';

async function removeMocks() {
  await redisClient.hdel('online:users', 'mock1');
  await redisClient.hdel('online:users', 'mock2');
  console.log('Mock users removed from Redis!');
  process.exit(0);
}

removeMocks();
