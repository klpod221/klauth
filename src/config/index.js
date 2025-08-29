const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    mongodbUri: process.env.MONGODB_URI,
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    },
    jwt: {
        privateKeyPath: process.env.PRIVATE_KEY_PATH,
        publicKeyPath: process.env.PUBLIC_KEY_PATH,
        accessExpirationMinutes: process.env.ACCESS_TOKEN_EXPIRES_IN,
        refreshExpirationDays: process.env.REFRESH_TOKEN_EXPIRES_IN,
    },
};
