import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

/**
 * Auth Service
 * Handles business logic for authentication
 */

// Register new user
export const registerUser = async (userData) => {
  const { name, email, password, phone_num, faculty, studentStatus, semester, graduationYear } = userData;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone_num,
    faculty,
    studentStatus,
    semester,
    graduationYear,
    verificationToken,
  });

  return user;
};

// Login user
export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  if (!user.isVerified) {
    throw new Error('Please verify your email first');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  return user;
};

// Verify email
export const verifyUserEmail = async (token) => {
  const user = await User.findOne({ verificationToken: token });
  if (!user) {
    throw new Error('Invalid verification token');
  }

  user.isVerified = true;
  user.verificationToken = null;
  await user.save();

  return user;
};

// Get user by ID
export const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password -refreshToken -verificationToken');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};