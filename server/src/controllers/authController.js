import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import {
  generateTokens,
  verifyToken,
  hashToken,
  setRefreshCookie,
  clearRefreshCookie,
} from '../services/tokenService.js';

const toPublicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  dept: user.dept,
  semester: user.semester,
});

// POST /api/auth/signup
export const signup = async (req, res, next) => {
  try {
    const { name, email, password, dept, semester } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: passwordHash, dept, semester });

    const { accessToken, refreshToken } = generateTokens(user);
    user.refreshToken = hashToken(refreshToken);
    await user.save();

    setRefreshCookie(res, refreshToken);
    return res.status(201).json({ user: toPublicUser(user), accessToken });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    next(err);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    // Generic message on BOTH branches -> no user enumeration.
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    user.refreshToken = hashToken(refreshToken);
    await user.save();

    setRefreshCookie(res, refreshToken);
    return res.status(200).json({ user: toPublicUser(user), accessToken });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/refresh
export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ error: 'No refresh token' });
    }

    let decoded;
    try {
      decoded = verifyToken(token, 'refresh');
    } catch {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const user = await User.findById(decoded.id);
    if (!user || !user.refreshToken) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Rotation: the stored hash must match the incoming token's hash.
    // If it doesn't, this token was already used (or is stale) -> reject.
    const incomingHash = hashToken(token);
    if (incomingHash !== user.refreshToken) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    user.refreshToken = hashToken(refreshToken);
    await user.save();

    setRefreshCookie(res, refreshToken);
    return res.status(200).json({ accessToken });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/logout
export const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      try {
        const decoded = verifyToken(token, 'refresh');
        await User.findByIdAndUpdate(decoded.id, { $set: { refreshToken: null } });
      } catch {
        // Token was already invalid/expired; clearing the cookie is enough.
      }
    }

    clearRefreshCookie(res);
    return res.status(200).json({ message: 'Logged out' });
  } catch (err) {
    next(err);
  }
};