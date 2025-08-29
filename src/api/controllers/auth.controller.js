const authService = require('../services/auth.service');
const tokenService = require('../services/token.service');
const catchAsync = require('../../utils/catchAsync');

const register = catchAsync(async (req, res) => {
  const user = await authService.createUser(req.body);
  const userResponse = user.toObject();
    delete userResponse.password;

  res.status(201).send(userResponse);
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.login(email, password);
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

module.exports = {
  register,
  login,
  getProfile,
  refreshToken,
  logout,
};
