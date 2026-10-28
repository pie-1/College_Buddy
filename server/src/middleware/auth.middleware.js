import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Ensure User model is imported if needed

export const requireAuth = async (req, res, next) => {
  try {
    // 1. Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Not authorized, no token' });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // 3. Attach user ID to request (Merged from both)
    req.userId = decoded.id;
    
    // Optional: If you need req.user for other things, you can fetch it here
    // const user = await User.findById(decoded.id);
    // req.user = user;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Not authorized, token failed' });
  }
};