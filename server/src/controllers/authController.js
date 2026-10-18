import User from '../models/User.js';
import { generateTokens, verifyToken } from '../services/tokenService.js';
import { sendVerificationEmail, sendResetPasswordEmail } from '../services/emailService.js';
import crypto from 'crypto';

/**
 * Auth Controller
 * @todo Add rate limiting
 * @todo Add refresh token rotation
 */

// Register new user
export const register = async (req, res) => {
  try {
    const { name, email, password, phone_num, faculty, studentStatus, semester, graduationYear } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Map old frontend fields to new strict schema enums
    // (Until the frontend is updated to send 'dept' and 'year')
    let mappedDept = 'COMPUTER';
    if (faculty === 'Civil') mappedDept = 'CIVIL';
    if (faculty === 'Architecture') mappedDept = 'ARCHI';
    if (faculty === 'BIT') mappedDept = 'BIT';
    
    let mappedYear = 1;
    if (semester === 6) mappedYear = 3;
    if (semester === 8) mappedYear = 4;

    // Create user 
    // ✅ Note: Password is NOT hashed here anymore! 
    // The User.js model automatically hashes it in the pre('save') hook.
    const user = await User.create({
      name,
      email,
      password: password, // Send plain password to model
      phone_num,
      dept: mappedDept,
      year: mappedYear,
      verificationToken,
      isVerified: process.env.NODE_ENV === 'development' ? true : false, 
    });

    // Send verification email
    if (process.env.NODE_ENV !== 'development') {
      await sendVerificationEmail(user.email, verificationToken);
    }

    res.status(201).json({
      success: true,
      message: process.env.NODE_ENV === 'development' 
        ? 'User registered (auto-verified in development)' 
        : 'User registered. Please verify your email.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dept: user.dept,
        trustScore: user.trustScore,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check verification (skip in dev mode)
    if (!user.isVerified && process.env.NODE_ENV !== 'development') {
      return res.status(401).json({ error: 'Please verify your email first' });
    }

    // ✅ Use the new method we created in User.js
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dept: user.dept,
        role: user.role,
        trustScore: user.trustScore,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Verify email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ error: 'Invalid verification token' });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Refresh token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const decoded = verifyToken(refreshToken, 'refresh');
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      success: true,
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get current user
export const getMe = async (req, res) => {
  try {
    // Note: User.js toJSON() automatically removes password and __v
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: error.message });
  }
};