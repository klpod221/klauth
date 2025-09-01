const express = require('express');
const authController = require('../controllers/auth.controller');
const auth = require('../middlewares/auth');

const validate = require('../middlewares/validate');
const authValidation = require('../validations/auth.validation');

const router = express.Router();

router.post('/register', authValidation.register, validate, authController.register);

router.post('/login', authValidation.login, validate, authController.login);

router.post('/logout', authValidation.logout, validate, authController.logout);

router.post('/refresh-token', authValidation.refreshToken, validate, authController.refreshToken);

router.get('/profile', auth, authController.getProfile);

router.post('/forgot-password', authValidation.forgotPassword, validate, authController.forgotPassword);

router.post('/verify-email', authValidation.verifyEmail, validate, authController.verifyEmail);

router.post('/reset-password', authValidation.resetPassword, validate, authController.resetPassword);

module.exports = router;
