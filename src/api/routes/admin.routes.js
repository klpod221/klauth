const express = require('express');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const validate = require('../middlewares/validate');
const adminValidation = require('../validations/admin.validation');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

router.use(auth, isAdmin);

router
  .route('/services')
  .post(adminValidation.createService, validate, adminController.createService)
  .get(adminController.getServices);

router
  .route('/services/:id')
  .get(adminController.getServiceById)
  .delete(adminController.deleteServiceById)
  .put(adminValidation.updateService, validate, adminController.updateServiceById);

router.get('/logs', adminValidation.getLogs, validate, adminController.getLogs);

module.exports = router;
