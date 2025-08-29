const { verifyToken } = require('../../utils/jwt');
const User = require('../models/user.model');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).send({ message: 'Authorization header is missing' });
    }

    // Token should be in the format: "Bearer <token>"
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).send({ message: 'Authentication token is missing' });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).send({ message: 'Invalid or expired token' });
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).send({ message: 'User not found' });
    }

    // Attach user to the request object
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    return res.status(401).send({ message: 'Please authenticate' });
  }
};

module.exports = auth;
