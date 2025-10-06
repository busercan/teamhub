import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined;

const redisClient = createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
  password: REDIS_PASSWORD,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

async function connectRedis() {
  try {
    await redisClient.connect();
    console.log('Redis connected');
  } catch (err) {
    console.error('Redis connection failed', err);
  }
}

connectRedis();

export default redisClient;
