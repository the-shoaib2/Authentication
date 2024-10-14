import jwt from 'jsonwebtoken';
import User from '../Models/UserModel.js';

/**
 * @description Middleware to authenticate socket connections using JWT.
 * @param {Socket} socket - The socket instance for the connection.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
export const authSocket = async (socket, next) => {
  const token = socket.handshake.query.token;

  if (!token) {
    return next(new Error('Authentication error: No token provided'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    socket.user = user; // Store user in socket for later use
    next();
  } catch (error) {
    return next(new Error(`Authentication error: ${error.message}`));
  }
};

export default { authSocket };
