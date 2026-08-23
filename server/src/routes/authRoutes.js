import express from 'express';
import {
  register,
  login,
  verifyEmail,
  refreshToken,
  logout,
  getMe,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../middleware/validation.js';

const router = express.Router();

// Public routes with validation
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/verify-email/:token', verifyEmail);
router.post('/refresh-token', refreshToken);

// Protected routes
router.use(protect);
router.post('/logout', logout);
router.get('/me', getMe);

export default router;