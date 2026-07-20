import jwt from 'jsonwebtoken';

/**
 * Token Service
 * @todo Add token rotation
 * @todo Add token blacklisting
 */

export const generateTokens = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role || 'student',
  };

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET || 'access_secret',
    { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET || 'refresh_secret',
    { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
  );

  return { accessToken, refreshToken };
};

export const verifyToken = (token, type = 'access') => {
  const secret = type === 'access' 
    ? process.env.JWT_ACCESS_SECRET || 'access_secret'
    : process.env.JWT_REFRESH_SECRET || 'refresh_secret';
  
  return jwt.verify(token, secret);
};

export const decodeToken = (token) => {
  return jwt.decode(token);
};