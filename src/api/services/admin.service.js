const ServiceConfig = require('../models/serviceConfig.model');
const ApiError = require('../../utils/ApiError');

/**
 * Create a new service configuration.
 * @param {Object} serviceBody - The service data.
 * @returns {Promise<ServiceConfig>}
 */
const createService = async (serviceBody) => {
  if (await ServiceConfig.findOne({ serviceName: serviceBody.serviceName })) {
    throw new ApiError(409, 'Service with this name already exists');
  }
  return ServiceConfig.create(serviceBody);
};

/**
 * Get all service configurations.
 * @returns {Promise<Array<ServiceConfig>>}
 */
const getServices = async () => {
  return ServiceConfig.find({});
};

module.exports = {
  createService,
  getServices,
};
