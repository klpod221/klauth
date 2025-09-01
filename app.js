const express = require('express');
const morgan = require('morgan');

const config = require('./src/config');
const logger = require('./src/utils/logger');

const authRoutes = require('./src/api/routes/auth.routes');
const adminRoutes = require('./src/api/routes/admin.routes');

const { apiLimiter } = require('./src/api/middlewares/rateLimiter');

const { errorConverter, errorHandler } = require('./src/api/middlewares/error');
const ApiError = require('./src/utils/ApiError');

const dynamicCors = require('./src/api/middlewares/dynamicCors');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(dynamicCors);

// HTTP request logger middleware
if (config.env !== 'test') {
    app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
}

// Public Assets
// app.use(express.static('public'));

// --- ROUTES ---
// Placeholder routes
app.get('/', (req, res) => {
    res.send('Auth Service is running!');
});

// Apply the rate limit to all API routes
app.use('/api', apiLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// --- ERROR HANDLING ---
// Send 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(404, 'Not found'));
});

// Convert error to ApiError, if needed
app.use(errorConverter);

// Handle errors
app.use(errorHandler);

module.exports = app;
