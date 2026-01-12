import express from 'express';
import { newsletterController } from '../controllers/newsletterController';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.post('/subscribe', newsletterController.subscribe);
router.post('/unsubscribe', newsletterController.unsubscribe);

// Admin routes (require authentication)
router.get('/subscribers', authenticate, newsletterController.getAllSubscribers);
router.get('/count', authenticate, newsletterController.getCount);

export default router;
