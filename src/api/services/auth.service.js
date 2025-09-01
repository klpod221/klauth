const User = require('../models/user.model');
const RefreshToken = require('../models/refreshToken.model');
const ApiError = require('../../utils/ApiError');
const config = require('../../config');

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
 * Generate email verification token for a user.
 * @param {User} user - The user instance.
 * @returns {Promise<string>} The verification token.
 */
const generateVerifyEmailToken = async (user) => {
  const token = user.generateToken('email');
  await user.save(); // Save the user document with the new token fields
  return token;
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

/**
 * @param {string} email - The email address of the user.
 * @returns {Promise<string>} - The password reset token.
 */
const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    return null;
  }
  const resetToken = user.generateToken('password');
  await user.save();
  return resetToken;
};

const verifyEmail = async (token) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, 'Token is invalid or has expired');
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();
};

const resetPassword = async (token, newPassword) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, 'Token is invalid or has expired');
  }

  user.password = newPassword; // The pre-save hook will hash it
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
};

/**
 * Resends a verification email if the user exists and is not yet verified.
 * @param {string} email - The user's email.
 * @returns {Promise<{user: User, token: string}|null>} An object with user and token if successful, otherwise null.
 */
const resendVerificationEmail = async (email) => {
  const user = await User.findOne({ email });

  if (!user || user.isEmailVerified) {
    return null;
  }

  // If verification token exists and is not expired return error
  if (user.emailVerificationToken && user.emailVerificationExpires > Date.now()) {
    const waitTime = Math.ceil((user.emailVerificationExpires - Date.now()) / (60 * 1000));
    throw new ApiError(400, `Verification email already sent, please wait ${waitTime} minutes before requesting a new one`);
  }

  // Generate a new verification token (this overwrites the old one)
  const verificationToken = user.generateToken('email');
  await user.save();

  return { user, token: verificationToken };
};

module.exports = {
  createUser,
  login,
  logout,
  forgotPassword,
  generateVerifyEmailToken,
  verifyEmail,
  resetPassword,
  resendVerificationEmail,
};
