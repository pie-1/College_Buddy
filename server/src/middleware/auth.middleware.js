import { verifyToken } from '../services/tokenService.js';
import User from '../models/User.js';

export const requireAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authorized, no token provided' });
    }

    const decoded = verifyToken(token, 'access');
    
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Not authorized, user not found' });
    }

    req.user = user;
    req.userId = user._id; // Added this so the controller can use req.userId
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Not authorized, token failed or expired' });
  }
};

export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authorized, no user found' });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ 
        error: `Forbidden: Requires ${role} role` 
      });
    }

    next();
  };
};