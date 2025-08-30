const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const config = require('./src/config');
const logger = require('./src/utils/logger');

const authRoutes = require('./src/api/routes/auth.routes');
const adminRoutes = require('./src/api/routes/admin.routes');
const adminUIRoutes = require('./src/admin/routes/admin.routes');

const { apiLimiter } = require('./src/api/middlewares/rateLimiter');

const { errorConverter, errorHandler } = require('./src/api/middlewares/error');
const ApiError = require('./src/utils/ApiError');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: config.mongodbUri,
    collectionName: 'sessions',
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    secure: config.env === 'production',
  },
}));

// HTTP request logger middleware
if (config.env !== 'test') {
    app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
}

// View Engine Setup for admin page
app.use(express.static('public'));
app.use(expressLayouts);
app.set('layout', 'layout');
app.set('view engine', 'ejs');
app.set('views', './src/admin/views');

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

// Admin Routes
app.use('/admin', adminUIRoutes);

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
