import express from 'express';
import { protect } from '../middleware/auth.js';
import { validateBorrow } from '../middleware/validation.js';
import {
  createRequest,
  getMyRequests,
  getMyLending,
  getRequest,
  acceptRequest,
  declineRequest,
  returnRequest,
} from '../controllers/borrowController.js';

const router = express.Router();

// Protected routes
router.use(protect);
router.post('/', validateBorrow, createRequest);
router.get('/my-requests', getMyRequests);
router.get('/my-lending', getMyLending);
router.get('/:id', getRequest);
router.put('/:id/accept', acceptRequest);
router.put('/:id/decline', declineRequest);
router.put('/:id/return', returnRequest);

export default router;