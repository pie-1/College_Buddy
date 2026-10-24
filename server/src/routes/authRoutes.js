import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { signup, login, refresh, logout, getMe } from '../controllers/authController.js';
import { validate, signupSchema, loginSchema } from '../validators/authValidator.js';
import { protect } from '../middleware/auth.js'; // NEW

const router = Router();

const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many signup attempts. Please try again in 15 minutes.' },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
});

router.post('/signup', signupLimiter, validate(signupSchema), signup);
router.post('/login', loginLimiter, validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', protect, getMe); // NEW

export default router;