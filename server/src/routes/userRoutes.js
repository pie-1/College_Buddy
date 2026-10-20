import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';
import { getUsers, getUser, updateUser, deleteUser } from '../controllers/userController.js';

const router = express.Router();

// ✅ Smoke Test 1: Valid Token -> 200 (and No token -> 401)
// This specifically tests requireAuth
router.get('/me', requireAuth, (req, res) => {
  res.json({ 
    success: true, 
    message: "You have accessed a protected route!", 
    user: req.user 
  });
});

// ✅ Smoke Test 2: Student calls admin route -> 403
// This specifically tests requireRole('admin')
router.get('/admin-test', requireAuth, requireRole('admin'), (req, res) => {
  res.json({ message: "Welcome Admin!" });
});

// Regular protected routes
// We use requireAuth here instead of the old 'protect' to test it out
router.get('/', requireAuth, getUsers);
router.get('/:id', requireAuth, getUser);
router.put('/:id', requireAuth, updateUser);
router.delete('/:id', requireAuth, deleteUser);

export default router;