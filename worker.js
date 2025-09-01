const { Worker } = require('bullmq');
const config = require('./src/config');
const { workerLogger } = require('./src/utils/logger');
const mailService = require('./src/api/services/mail.service');

workerLogger.info('Worker process started.');

const worker = new Worker('mail-queue', async (job) => {
  workerLogger.info(`Processing job '${job.name}' with data:`, job.data);
  switch (job.name) {
    case 'send-verification-email':
      await mailService.sendVerificationEmail(job.data.to, job.data.token);
      break;
    case 'send-reset-password-email':
      await mailService.sendResetPasswordEmail(job.data.to, job.data.token);
      break;
    default:
      throw new Error(`Unknown job name: ${job.name}`);
  }
}, {
  connection: {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
  },
});

worker.on('completed', (job) => {
  workerLogger.info(`Job ${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  workerLogger.error(`Job ${job.id} has failed with ${err.message}`);
});
