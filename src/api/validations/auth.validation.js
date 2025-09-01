const { body } = require('express-validator');

const register = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

const login = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

const refreshToken = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
];

const logout = refreshToken;

const forgotPassword = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
];

const verifyEmail = [body('token').notEmpty().withMessage('Token is required')];

const resendVerificationEmail = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
];

const resetPassword = [
  body('token').notEmpty().withMessage('Token is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
];

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  forgotPassword,
  verifyEmail,
  resetPassword,
  resendVerificationEmail
};
