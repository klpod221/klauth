const express = require('express');
const authController = require('../controllers/auth.controller');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/profile', auth, authController.getProfile);

router.post('/refresh-token', authController.refreshToken);

router.post('/logout', authController.logout);

module.exports = router;
