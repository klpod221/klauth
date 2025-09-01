const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const { MongoDB } = require('winston-mongodb');
const path = require('path');
const config = require('../config');

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// --- API Logger ---
const apiTransports = [
  new DailyRotateFile({
    filename: path.join(__dirname, '../../logs/klauth-api-error-%DATE%.log'),
    level: 'error',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  }),
  new DailyRotateFile({
    filename: path.join(__dirname, '../../logs/klauth-api-combined-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  }),
];

if (config.env !== 'production') {
  apiTransports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
} else {
  apiTransports.push(
    new MongoDB({
      level: 'info',
      db: config.mongodbUri,
      collection: 'logs_api',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      capped: true,
      cappedSize: 10000000,
    })
  );
}

const apiLogger = winston.createLogger({
  level: config.env === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: apiTransports,
  exitOnError: false,
});

// --- Worker Logger ---
const workerTransports = [
  new DailyRotateFile({
    filename: path.join(__dirname, '../../logs/klauth-worker-error-%DATE%.log'),
    level: 'error',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  }),
  new DailyRotateFile({
    filename: path.join(__dirname, '../../logs/klauth-worker-combined-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  }),
];

if (config.env !== 'production') {
  workerTransports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
} else {
  workerTransports.push(
    new MongoDB({
      level: 'info',
      db: config.mongodbUri,
      collection: 'logs_worker',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      capped: true,
      cappedSize: 10000000,
    })
  );
}

const workerLogger = winston.createLogger({
  level: config.env === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: workerTransports,
  exitOnError: false,
});

module.exports = {
  apiLogger,
  workerLogger,
};
