import express from 'express';
import { getUsers, getUser, updateUser, deleteUser, updateMe } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.get('/', getUsers);
router.get('/:id', getUser);
router.patch('/me', uploadSingle, updateMe);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;