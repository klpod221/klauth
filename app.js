const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const config = require('./src/config');
const logger = require('./src/utils/logger');

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

// TODO: Add API and Dashboard routes later

// --- ERROR HANDLING ---
// TODO: Add error handling middlewares later

module.exports = app;
