const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const config = require('./src/config');
const logger = require('./src/utils/logger');

// API Route
const authRoutes = require('./src/api/routes/auth.routes');

// Error Handler
const { errorConverter, errorHandler } = require('./src/api/middlewares/error');
const ApiError = require('./src/utils/ApiError');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// HTTP request logger middleware
if (config.env !== 'test') {
    app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
}

// View Engine Setup for Dashboard
app.use(express.static('public'));
app.use(expressLayouts);
app.set('layout', './dashboard/views/layout');
app.set('view engine', 'ejs');
app.set('views', './src/dashboard/views');


// --- ROUTES ---
// Placeholder routes
app.get('/', (req, res) => {
    res.send('Auth Service is running!');
});

// API Routes
app.use('/api/auth', authRoutes);

// TODO: Add Dashboard routes later

// --- ERROR HANDLING ---
// Send 404 error for any unknown api request
app.get('/', (req, res) => {
    res.send('Auth Service is running!');
});

// Convert error to ApiError, if needed
app.use(errorConverter);

// Handle errors
app.use(errorHandler);

module.exports = app;
