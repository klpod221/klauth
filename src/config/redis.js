const redis = require('redis');
const config = require('./index');
const logger = require('../utils/logger');

const redisClient = redis.createClient({
  url: `redis://:${config.redis.password}@${config.redis.host}:${config.redis.port}`,
});

redisClient.on('connect', () => {
  logger.info('Redis connected successfully');
});

redisClient.on('error', (error) => {
  logger.error('Redis connection error:', error);
});

// Explicitly connect the client
(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;
