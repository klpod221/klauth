const { Queue } = require('bullmq');
const config = require('../config');

const mailQueue = new Queue('mail-queue', {
  connection: {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
  },
});

const addMailJob = async (jobName, data) => {
  await mailQueue.add(jobName, data, {
    attempts: 3, // Retry job 3 times if it fails
    backoff: {
      type: 'exponential',
      delay: 5000, // Wait 5s before the first retry
    },
  });
};

module.exports = { addMailJob };
