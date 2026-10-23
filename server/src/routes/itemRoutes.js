import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js'; // ✅ Fix: Use requireAuth
import { validateCreateItem } from '../validators/item.validator.js'; 
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
router.use(requireAuth); // ✅ Fix: Sets req.userId

router.get('/my/items', getMyItems);
router.get('/user/:userId', getItemsByUser);

// Create item
router.post('/', uploadMultiple, validateCreateItem, createItem);

// Update item
router.patch('/:id', uploadMultiple, updateItem);

// Toggle availability
router.patch('/:id/toggle', toggleAvailability);

// Delete item
router.delete('/:id', deleteItem);

export default router;