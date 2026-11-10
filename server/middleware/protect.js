const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes that require authentication
const protect = async (req, res, next) => {
  let token;

  // 1. Check if token exists in Authorization header: "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      // 2. Extract token from header
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify token with secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Find user by id from decoded token (exclude password for security)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // 5. Proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.error('JWT verification error:', error.message);
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  }

  // If no token was provided
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = protect;

