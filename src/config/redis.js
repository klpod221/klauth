const redis = require('redis');
const config = require('./index');
const { apiLogger } = require('../utils/logger');

const redisClient = redis.createClient({
  url: `redis://:${config.redis.password}@${config.redis.host}:${config.redis.port}`,
});

redisClient.on('connect', () => {
  apiLogger.info('Redis connected successfully');
});

redisClient.on('error', (error) => {
  apiLogger.error('Redis connection error:', error);
});

// Explicitly connect the client
(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;
