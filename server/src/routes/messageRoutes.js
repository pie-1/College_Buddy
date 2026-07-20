import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  sendMessage,
  getConversations,
  getMessages,
  markAsRead,
  getUnreadCount,
} from '../controllers/messageController.js';

const router = express.Router();

// Protected routes
router.use(protect);
router.post('/', sendMessage);
router.get('/conversations', getConversations);
router.get('/conversation/:userId', getMessages);
router.put('/:id/read', markAsRead);
router.get('/unread-count', getUnreadCount);


export default router;