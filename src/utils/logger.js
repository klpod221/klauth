const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const { MongoDB } = require('winston-mongodb');
const path = require('path');
const config = require('../config');

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json() // Log in JSON format for easier parsing
);

const transports = [
  new DailyRotateFile({
    filename: path.join(__dirname, '../../logs/klauth-error-%DATE%.log'),
    level: 'error',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  }),
  new DailyRotateFile({
    filename: path.join(__dirname, '../../logs/klauth-combined-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  }),
];

if (config.env === 'production') {
  transports.push(
    new MongoDB({
      level: 'info',
      db: config.mongodbUri,
      options: { useUnifiedTopology: true },
      collection: 'logs',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      capped: true, // Use a capped collection for performance
      cappedSize: 10000000, // 10MB
    })
  );
} else {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

const logger = winston.createLogger({
  level: config.env === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports,
  exitOnError: false, // Do not exit on handled exceptions
});

module.exports = logger;
