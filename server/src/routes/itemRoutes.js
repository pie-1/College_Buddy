import express from 'express';
import { protect } from '../middleware/auth.js';
import { validateItem } from '../middleware/validation.js';
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

// Protected routes
router.use(protect);
router.get('/my/items', getMyItems);
router.get('/user/:userId', getItemsByUser);

// Create item with image upload (max 5 images)
router.post('/', uploadMultiple, validateItem, createItem);

// Update item with image upload
router.put('/:id', uploadMultiple, updateItem);

// Toggle availability
router.patch('/:id/toggle', toggleAvailability);

// Delete item
router.delete('/:id', deleteItem);

export default router;