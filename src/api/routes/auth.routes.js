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

module.exports = router;
