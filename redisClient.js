
const { createClient } = require('redis');
const dotenv = require('dotenv')
dotenv.config();

let client;

async function getRedisClient() {
  if (!client) {
// redisClient = new Redis( {host: process.env.REDIS_HOST , 
// port: process.env.REDIS_PORT});
//     redisClient.on('error', (err) => console.error('Redis error:', err));
const redisClient = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
  }
});

// username: 'default',
// password: 'WCrbnd8cITU4cTua1phzKszikbQ5MFDJ',
// socket: {
//     host: 'redis-12868.c61.us-east-1-3.ec2.redns.redis-cloud.com',
//     port: 12868
// }
// });


redisClient.on('error', err => console.log('Redis Client Error', err));

await redisClient.connect('connect', () => {
  console.log('Connected to Redis');
});

await redisClient.set('foo', 'bar');
const result = await redisClient.get('foo');
console.log(result)  // >>> bar
return redisClient;
  }
}

module.exports = getRedisClient;
