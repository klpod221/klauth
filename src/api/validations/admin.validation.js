const { body } = require('express-validator');
const { query } = require('express-validator');

const createService = [
  body('serviceName').notEmpty().withMessage('Service name is required'),
  body('allowedOrigins').isArray().withMessage('Allowed origins must be an array'),
  body('allowedOrigins.*').isURL({ require_tld: false }).withMessage('Each origin must be a valid URL'),
  body('rateLimit.windowMs').isInt({ min: 1000 }).withMessage('Rate limit window must be at least 1000ms'),
  body('rateLimit.max').isInt({ min: 1 }).withMessage('Rate limit max requests must be at least 1'),
];

const updateService = [
  body('serviceName').optional().notEmpty().withMessage('Service name is required'),
  body('allowedOrigins').optional().isArray().withMessage('Allowed origins must be an array'),
  body('allowedOrigins.*').optional().isURL({ require_tld: false }).withMessage('Each origin must be a valid URL'),
  body('rateLimit.windowMs').optional().isInt({ min: 1000 }).withMessage('Rate limit window must be at least 1000ms'),
  body('rateLimit.max').optional().isInt({ min: 1 }).withMessage('Rate limit max requests must be at least 1'),
];

const getLogs = [
  query('level').optional().isString().isIn(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
];

module.exports = {
  createService,
  updateService,
  getLogs,
};
