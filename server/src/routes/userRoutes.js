import express from 'express';
import { 
  getUsers, 
  getUser, 
  updateUser, 
  deleteUser, 
  updateMe,
  getMyProfile,
  updateMyProfile
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// 1. Protected routes for the logged-in user
router.use(protect);

// Onboarding wizard uses this (your branch)
router.patch('/me', uploadSingle, updateMe);

// Dev branch profile routes
router.get('/me', getMyProfile);
router.patch('/me/profile', updateMyProfile);

// 2. Public/Admin routes
router.get('/', getUsers);
router.get('/:id', getUser); // MUST be below /me
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;