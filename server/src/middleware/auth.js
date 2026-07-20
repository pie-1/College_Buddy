import { verifyToken } from '../services/tokenService.js';
import User from '../models/User.js';

/**
 * Authentication Middleware
 * @todo Add role-based access control
 * @todo Add rate limiting per user
 */

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authorized, no token' });
    }

    const decoded = verifyToken(token, 'access');
    const user = await User.findById(decoded.id).select('-password -refreshToken -verificationToken');

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Not authorized, user not found or inactive' });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Not authorized, token failed' });
  }
};


export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    
    next();
  };
};