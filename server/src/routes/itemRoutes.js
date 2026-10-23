import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { uploadMultiple } from '../middleware/upload.js';
import {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getMyItems,
  getItemsByUser,
  toggleAvailability,
} from '../controllers/itemController.js';

const router = express.Router();

// Public routes
router.get('/', getItems);
router.get('/:id', getItem);

// Protected routes (All routes below require authentication)
router.use(requireAuth);

router.get('/my/items', getMyItems);
router.get('/user/:userId', getItemsByUser);

// Create item with image upload (max 3 images) and Zod validation
router.post('/', uploadMultiple, createItem);
// Update item (PATCH method as requested)
router.patch('/:id', uploadMultiple, updateItem);

// Toggle availability
router.patch('/:id/toggle', toggleAvailability);

// Delete item
router.delete('/:id', deleteItem);

export default router;