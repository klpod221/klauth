const express = require('express');
const adminController = require('../controllers/admin.controller');
const isAuthAdminUI = require('../middlewares/isAuthAdminUI');

const router = express.Router();

// Public routes for admin login/logout
router.get('/login', adminController.renderLoginPage);
router.post('/login', adminController.handleLogin);
router.post('/logout', adminController.handleLogout);

// Protected admin routes
router.get('/services', isAuthAdminUI, adminController.renderServicesPage);
router.post('/services', isAuthAdminUI, adminController.handleCreateService);

router.get('/', isAuthAdminUI, (req, res) => res.redirect('/admin/services'));

module.exports = router;
