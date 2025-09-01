const nodemailer = require('nodemailer');
const config = require('../../config');
const logger = require('../../utils/logger');

const transporter = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  auth: {
    user: config.mail.user,
    pass: config.mail.pass,
  },
});

/**
 * Sends a verification email to a new user.
 * @param {string} to - The recipient's email address.
 * @param {string} token - The verification token.
 */
const sendVerificationEmail = async (to, token) => {
  const verificationLink = `http://yourapp.com/verify-email?token=${token}`;
  const subject = 'Welcome to KLAuth! Please Verify Your Email';
  const text = `Welcome! Please verify your email by clicking on this link: ${verificationLink}`;
  const html = `<b>Welcome!</b><p>Please verify your email by clicking on this link: <a href="${verificationLink}">${verificationLink}</a></p>`;

  await transporter.sendMail({ from: config.mail.from, to, subject, text, html });
  logger.info(`Verification email sent to ${to}`);
};

/**
 * Sends a password reset email.
 * @param {string} to - The recipient's email address.
 * @param {string} token - The password reset token.
 */
const sendResetPasswordEmail = async (to, token) => {
  const resetLink = `http://yourapp.com/reset-password?token=${token}`;
  const subject = 'KLAuth - Password Reset Request';
  const text = `You requested a password reset. Click this link to reset your password: ${resetLink}`;
  const html = `<b>Password Reset</b><p>You requested a password reset. Click this link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`;

  await transporter.sendMail({ from: config.mail.from, to, subject, text, html });
  logger.info(`Password reset email sent to ${to}`);
};

module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail,
};
