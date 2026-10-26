import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js'; 
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
router.use(requireAuth);

router.get('/my/items', getMyItems);
router.get('/user/:userId', getItemsByUser);

// POST /api/items (protected + Zod validation + file upload support)
router.post('/', uploadMultiple, validateCreateItem, createItem);

// Update item (PATCH method)
router.patch('/:id', uploadMultiple, updateItem);

// Toggle availability
router.patch('/:id/toggle', toggleAvailability);

// Delete item
router.delete('/:id', deleteItem);

export default router;