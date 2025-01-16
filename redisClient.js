const Redis = require('ioredis');

let redisClient;

function getRedisClient() {
  if (!redisClient) {
    redisClient = new Redis();
    redisClient.on('error', (err) => console.error('Redis error:', err));
  }
  return redisClient;
}

module.exports = getRedisClient;
