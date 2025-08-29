const crypto = require('crypto');
const moment = require('moment');
const { parseDuration } = require('../../utils/parseDuration');
const { signToken } = require('../../utils/jwt');
const config = require('../../config');
const RefreshToken = require('../models/refreshToken.model');
const User = require('../models/user.model');
const ApiError = require('../../utils/ApiError');

/**
 * Generate a random string for the refresh token.
 * @returns {string}
 */
const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString('hex');
};

/**
 * Generate access and refresh tokens for a user.
 * @param {Object} user - The user object.
 * @returns {Promise<Object>} - An object containing the token information.
 */
const generateAuthTokens = async (user) => {
  const { value: accessValue, unit: accessUnit } = parseDuration(config.jwt.accessExpiresIn);
  const accessTokenExpires = moment().add(accessValue, accessUnit);

  const accessTokenPayload = {
    sub: user.id,
    role: user.role,
  };

  const accessToken = signToken(accessTokenPayload, config.jwt.accessExpiresIn);

  const refreshToken = generateRefreshToken();

  const { value: refreshValue, unit: refreshUnit } = parseDuration(config.jwt.refreshExpiresIn);
  const refreshTokenExpires = moment().add(refreshValue, refreshUnit);

  await RefreshToken.create({
    token: refreshToken,
    user: user.id,
    expires: refreshTokenExpires.toDate(),
  });

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Refresh auth tokens.
 * @param {string} refreshToken - The refresh token.
 * @returns {Promise<Object>} - A new pair of tokens.
 * @throws {Error} If the refresh token is invalid, expired, or not found.
 */
const refreshAuth = async (refreshToken) => {
  // Find the refresh token in the database
  const refreshTokenDoc = await RefreshToken.findOne({ token: refreshToken });

  if (!refreshTokenDoc) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  // Check if the token has expired
  if (new Date() > refreshTokenDoc.expires) {
    await refreshTokenDoc.deleteOne(); // Clean up expired token
    throw new ApiError(401, 'Refresh token has expired');
  }

  // Get the associated user
  const user = await User.findById(refreshTokenDoc.user);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // IMPORTANT: Revoke the used refresh token (Token Rotation)
  await refreshTokenDoc.deleteOne();

  // Generate a new pair of tokens
  return generateAuthTokens(user);
};

module.exports = {
  generateAuthTokens,
  refreshAuth,
};
