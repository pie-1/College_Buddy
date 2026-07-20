import express from 'express';
import { protect } from '../middleware/auth.js';
import { getUsers, getUser, updateUser, deleteUser } from '../controllers/userController.js';

const router = express.Router();

// Protected routes
router.use(protect);
router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// ✅ ADD THIS
export default router;