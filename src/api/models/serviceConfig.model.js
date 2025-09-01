const mongoose = require('mongoose');

const serviceConfigSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    allowedOrigins: {
      type: [String],
      default: [],
    },
    rateLimit: {
      windowMs: {
        type: Number,
        required: true,
        default: 15 * 60 * 1000,
      },
      max: {
        type: Number,
        required: true,
        default: 100,
      },
    }
  },
  {
    timestamps: true,
  }
);

const ServiceConfig = mongoose.model('ServiceConfig', serviceConfigSchema);

module.exports = ServiceConfig;
