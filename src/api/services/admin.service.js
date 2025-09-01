const ServiceConfig = require('../models/serviceConfig.model');
const ApiError = require('../../utils/ApiError');
const mongoose = require('mongoose');

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
const getServices = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const services = await ServiceConfig.find({}).skip(skip).limit(limit).sort({ createdAt: -1 });
  const totalItems = await ServiceConfig.countDocuments();
  const totalPages = Math.ceil(totalItems / limit);
  return { services, totalPages, currentPage: page, totalItems };
};

/**
 * Get service by id
 * @param {string} serviceId - The ID of the service.
 * @returns {Promise<ServiceConfig>}
 */
const getServiceById = async (serviceId) => {
  const service = await ServiceConfig.findById(serviceId);
  if (!service) {
    throw new ApiError(404, 'Service not found');
  }
  return service;
};

/**
 * Delete a service by its ID.
 * @param {string} serviceId - The ID of the service.
 * @returns {Promise<void>}
 */
const deleteServiceById = async (serviceId) => {
  const service = await ServiceConfig.findByIdAndDelete(serviceId);
  if (!service) {
    throw new ApiError(404, 'Service not found');
  }
};

const updateServiceById = async (serviceId, updateBody) => {
  const service = await getServiceById(serviceId);
  Object.assign(service, updateBody);
  await service.save();
  return service;
};

const findServiceByOrigin = async (origin) => {
  return ServiceConfig.findOne({ origin });
};

/**
 * Query for logs with pagination.
 * @param {Object} queryOptions - Query options
 * @param {string} [queryOptions.level] - Filter by log level
 * @param {number} [queryOptions.page] - Current page
 * @param {number} [queryOptions.limit] - Results per page
 * @returns {Promise<Object>}
 */
const getLogs = async (queryOptions) => {
  const { level } = queryOptions;

  const page = parseInt(queryOptions.page, 10) || 1;
  const limit = parseInt(queryOptions.limit, 10) || 20;

  const filter = {};
  if (level) {
    filter.level = level;
  }

  const skip = (page - 1) * limit;

  // Access the 'logs' collection directly
  const logsCollection = mongoose.connection.collection('logs');

  const logs = await logsCollection
    .find(filter)
    .sort({ timestamp: -1 }) // Show latest logs first
    .skip(skip)
    .limit(limit)
    .toArray();

  const totalItems = await logsCollection.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / limit);

  return { logs, totalPages, currentPage: page, totalItems };
};

module.exports = {
  createService,
  getServices,
  getServiceById,
  findServiceByOrigin,
  deleteServiceById,
  updateServiceById,
  getLogs
};
