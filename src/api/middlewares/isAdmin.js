const ApiError = require('../../utils/ApiError');

const isAdmin = (req, res, next) => {
  // This middleware should run after the `auth` middleware
  if (!req.user || req.user.role !== 'admin') {
    return next(new ApiError(403, 'Forbidden: Admin access required'));
  }
  next();
};

module.exports = isAdmin;
