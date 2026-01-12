import { Router } from 'express';
import * as settingsController from '../controllers/settingsController';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public route
router.get('/', settingsController.getSettings);

// Protected routes (admin only)
// Protected routes (admin only)
router.put('/', authenticate, settingsController.updateSettings);

// API Keys - Protected
router.post('/keys', authenticate, settingsController.generateApiKey);
router.delete('/keys/:key', authenticate, settingsController.revokeApiKey);

export default router;
