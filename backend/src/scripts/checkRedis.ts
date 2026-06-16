import { Redis } from '@upstash/redis';
import { ENV } from '../config/env';

const redisClient = new Redis({
  url: ENV.UPSTASH_REDIS_REST_URL,
  token: ENV.UPSTASH_REDIS_REST_TOKEN,
});

async function test() {
  const queueName = 'test-queue';
  await redisClient.del(queueName);
  
  const obj = { socketId: '123', userId: '456' };
  await redisClient.rpush(queueName, obj);
  
  const list = await redisClient.lrange<any>(queueName, 0, -1);
  console.log('List after push:', list);
  
  // Try to remove using the parsed object
  const removedObj = await redisClient.lrem(queueName, 1, list[0]);
  console.log('Removed count using object:', removedObj);
  
  const list2 = await redisClient.lrange<any>(queueName, 0, -1);
  console.log('List after object remove:', list2);
  
  // Try to remove using exact string
  const removedStr = await redisClient.lrem(queueName, 1, JSON.stringify(obj));
  console.log('Removed count using exact string:', removedStr);
  
  const list3 = await redisClient.lrange<any>(queueName, 0, -1);
  console.log('List after string remove:', list3);
  
  await redisClient.del(queueName);
}

test().catch(console.error);
