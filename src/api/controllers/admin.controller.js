const catchAsync = require('../../utils/catchAsync');
const adminService = require('../services/admin.service');

const createService = catchAsync(async (req, res) => {
  const service = await adminService.createService(req.body);
  res.status(201).send(service);
});

const getServices = catchAsync(async (req, res) => {
  const services = await adminService.getServices();
  res.send(services);
});

module.exports = {
  createService,
  getServices,
};
