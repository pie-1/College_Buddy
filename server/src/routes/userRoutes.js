import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js'; 
import { getRoommates } from '../controllers/userController.js';
import { 
  getUser, 
  getMyProfile, 
  updateMyProfile, 
  getUsers, 
  deleteUser 
} from '../controllers/userController.js';

const router = express.Router();

// 1. Protected routes for the logged-in user
router.get('/me', requireAuth, getMyProfile);
router.patch('/me', requireAuth, updateMyProfile);

// 2. Public/Admin routes
router.get('/', getUsers);
router.get('/:id', getUser); 
router.get('/roommates', getRoommates);


export default router;