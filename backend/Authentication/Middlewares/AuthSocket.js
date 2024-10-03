const jwt = require('jsonwebtoken');
const User = require('../Models/User');

module.exports = (socket, next) => {
  const token = socket.handshake.query.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return next(new Error('Authentication error'));
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new Error('Authentication error'));
    }

    socket.user = user; // Store user in socket for later use
    next();
  });
};
