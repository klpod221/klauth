const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  // Get the first error message for a simple response
  const firstError = errors.array({ onlyFirstError: true })[0].msg;

  // Pass a structured error to our centralized error handler
  return next(new ApiError(400, firstError));
};

module.exports = validate;
