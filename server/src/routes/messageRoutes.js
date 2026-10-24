import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import {
  sendMessage,
  getConversations,
  getMessages,
  markAsRead,
  getUnreadCount
} from '../controllers/messageController.js';

const router = express.Router();

// All message routes require authentication
router.use(requireAuth);

router.post('/', sendMessage);
router.get('/conversations', getConversations);
router.get('/unread/count', getUnreadCount);
router.get('/:userId', getMessages); 
router.put('/:id/read', markAsRead);

export default router;