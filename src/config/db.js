const mongoose = require('mongoose');
const config = require('./index');
const { apiLogger } = require('../utils/logger');

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    apiLogger.info('MongoDB connected successfully');
  } catch (error) {
    apiLogger.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
