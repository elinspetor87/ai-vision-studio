import { Router } from 'express';
import * as commentController from '../controllers/commentController';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/post/:postId', commentController.getCommentsByPost);
router.post('/post/:postId', commentController.createComment);

// Admin routes (require authentication)
router.get('/', authenticate, commentController.getAllComments);
router.patch('/:id/approve', authenticate, commentController.approveComment);
router.delete('/:id', authenticate, commentController.deleteComment);

export default router;
