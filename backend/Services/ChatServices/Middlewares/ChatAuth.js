import jwt from 'jsonwebtoken';

export const chatAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authentication failed: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication failed: No token provided' });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decodedToken.userId };
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: 'Authentication failed: Invalid token' });
  }
};

// Export all functions
export default {
    chatAuth
};
