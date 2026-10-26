import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
  getUsers, 
  getUser, 
  getRoommates, 
  updateMe,
  getMyProfile,
  updateMyProfile 
} from '../controllers/userController.js';

const router = express.Router();
router.use(protect);

// 1. Roommates route 
router.get('/roommates', getRoommates);

// 2. Profile routes
router.get('/me', getMyProfile);
router.patch('/me/profile', updateMyProfile);

// 3. Other routes
router.get('/', getUsers);
router.get('/:id', getUser);

export default router;