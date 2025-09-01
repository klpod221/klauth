const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  appUrl: process.env.APP_URL,
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongodbUri: process.env.MONGODB_URI || `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin`,
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
  jwt: {
    privateKeyPath: process.env.PRIVATE_KEY_PATH,
    publicKeyPath: process.env.PUBLIC_KEY_PATH,
    accessExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  },
  sessionSecret: process.env.SESSION_SECRET,
  mail: {
    enabled: process.env.MAIL_ENABLED === 'true',
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT, 10),
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    from: process.env.MAIL_FROM,
  },
};
