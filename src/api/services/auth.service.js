const User = require('../models/user.model');
const RefreshToken = require('../models/refreshToken.model');
const ApiError = require('../../utils/ApiError');

/**
 * Create a user.
 * @param {Object} userBody - The user data.
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.findOne({ email: userBody.email })) {
    throw new ApiError(400, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Login with username and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<User>}
 */
const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(401, 'Incorrect email or password');
  }
  return user;
};

/**
 * Logout a user by deleting their refresh token.
 * @param {string} refreshToken - The refresh token to be deleted.
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await RefreshToken.findOne({ token: refreshToken });
  if (!refreshTokenDoc) {
    throw new ApiError(404, 'Refresh token not found');
  }
  await refreshTokenDoc.deleteOne();
};

module.exports = {
  createUser,
  login,
  logout,
};
