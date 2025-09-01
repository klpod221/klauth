const cors = require('cors');
const ApiError = require('../../utils/ApiError');
const adminService = require('../services/admin.service');

const corsOptionsDelegate = async (req, callback) => {
  const origin = req.header('Origin');

  if (!origin) {
    return callback(null, { origin: true }); // Allow
  }

  try {
    const service = await adminService.findServiceByOrigin(origin);

    if (service) {
      callback(null, { origin: true }); // Allow
    } else {
      callback(new ApiError(403, `CORS policy does not allow access from origin: ${origin}`));
    }
  } catch (error) {
    callback(error);
  }
};

module.exports = cors(corsOptionsDelegate);
