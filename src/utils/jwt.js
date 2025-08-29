const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const config = require('../config');

// Read the keys once when the module is loaded
const privateKey = fs.readFileSync(path.join(__dirname, '../..', config.jwt.privateKeyPath), 'utf8');
const publicKey = fs.readFileSync(path.join(__dirname, '../..', config.jwt.publicKeyPath), 'utf8');

/**
 * Signs a payload to create a JWT.
 * @param {Object} payload - The payload to sign.
 * @param {string} expiresIn - The expiration time for the token (e.g., "15m", "7d").
 * @returns {string} - The generated JWT.
 */
const signToken = (payload, expiresIn) => {
  return jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn,
  });
};

/**
 * Verifies a JWT.
 * @param {string} token - The JWT to verify.
 * @returns {Object|null} - The decoded payload if the token is valid, otherwise null.
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, publicKey, { algorithms: ['RS256'] });
  } catch (error) {
    return null;
  }
};

module.exports = {
  signToken,
  verifyToken,
};
