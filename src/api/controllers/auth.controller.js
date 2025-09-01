const authService = require('../services/auth.service');
const tokenService = require('../services/token.service');
const catchAsync = require('../../utils/catchAsync');
const config = require('../../config');
const { addMailJob } = require('../../jobs/mail.producer');

const register = catchAsync(async (req, res) => {
  const user = await authService.createUser(req.body);

  if (config.mail.enabled) {
    const verificationToken = await authService.generateVerifyEmailToken(user);
    await addMailJob('send-verification-email', { to: user.email, token: verificationToken });
  }

  const userResponse = user.toObject();
  delete userResponse.password;
  res.status(201).send(userResponse);
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.login(email, password);

  if (config.mail.enabled && !user.isEmailVerified) {
    throw new ApiError(401, 'Please verify your email before logging in');
  }

  const tokens = await tokenService.generateAuthTokens(user);
  res.send(tokens);
});

const getProfile = catchAsync(async (req, res) => {
  const user = req.user.toObject();
  delete user.password;
  res.send(user);
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).send({ message: 'Refresh token is required' });
  }
  const newTokens = await tokenService.refreshAuth(refreshToken);
  res.send(newTokens);
});

const logout = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).send({ message: 'Refresh token is required' });
  }
  await authService.logout(refreshToken);
  res.status(204).send();
});


const forgotPassword = catchAsync(async (req, res) => {
  const resetToken = await authService.forgotPassword(req.body.email);

  // Only queue the job if a user was found and a token was generated
  if (resetToken && config.mail.enabled) {
    await addMailJob('send-reset-password-email', { to: req.body.email, token: resetToken });
  }

  // Always send a generic message to prevent attackers from knowing if an email exists
  res.status(200).send({ message: 'If an account with that email exists, a password reset link has been sent.' });
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.body.token);
  res.status(200).send({ message: 'Email verified successfully.' });
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.body.token, req.body.password);
  res.status(200).send({ message: 'Password has been reset successfully.' });
});

module.exports = {
  register,
  login,
  getProfile,
  refreshToken,
  logout,
  forgotPassword,
  verifyEmail,
  resetPassword
};
