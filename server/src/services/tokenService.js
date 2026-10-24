import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/**
 * Token Service
 * Single source of truth for JWT signing, verification, hashing,
 * and refresh-cookie handling.
 */

const ACCESS_TTL = process.env.JWT_ACCESS_EXPIRY || '15m';
const REFRESH_TTL = process.env.JWT_REFRESH_EXPIRY || '7d';
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export const generateTokens = (user) => {
  const payload = { 
    id: user._id, 
    email: user.email,
    jti: crypto.randomUUID() // Ensures every token is unique
  };

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET || 'access_secret',
    { expiresIn: ACCESS_TTL }
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET || 'refresh_secret',
    { expiresIn: REFRESH_TTL }
  );

  return { accessToken, refreshToken };
};

export const verifyToken = (token, type = 'access') => {
  const secret =
    type === 'access'
      ? process.env.JWT_ACCESS_SECRET || 'access_secret'
      : process.env.JWT_REFRESH_SECRET || 'refresh_secret';

  return jwt.verify(token, secret);
};

export const decodeToken = (token) => jwt.decode(token);

export const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

export const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: REFRESH_TTL_MS,
    path: '/api/auth',
  });
};

export const clearRefreshCookie = (res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/auth',
  });
};