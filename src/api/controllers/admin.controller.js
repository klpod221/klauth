const catchAsync = require('../../utils/catchAsync');
const adminService = require('../services/admin.service');

const createService = catchAsync(async (req, res) => {
  const service = await adminService.createService(req.body);
  res.status(201).send(service);
});

const getServices = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const result = await adminService.getServices(page, limit);
  res.send(result);
});

const getServiceById = catchAsync(async (req, res) => {
  const service = await adminService.getServiceById(req.params.id);
  res.send(service);
});

const deleteServiceById = catchAsync(async (req, res) => {
  await adminService.deleteServiceById(req.params.id);
  res.status(204).send();
});

const updateServiceById = catchAsync(async (req, res) => {
  const service = await adminService.updateServiceById(req.params.id, req.body);
  res.send(service);
});

const getLogs = catchAsync(async (req, res) => {
  const result = await adminService.getLogs(req.query);
  res.send(result);
});

module.exports = {
  createService,
  getServices,
  getServiceById,
  deleteServiceById,
  updateServiceById,
  getLogs
};
