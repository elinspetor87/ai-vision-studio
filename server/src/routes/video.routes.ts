import { Router } from 'express';
import * as videoController from '../controllers/videoController';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../utils/validation';
import { createVideoProjectSchema, updateVideoProjectSchema } from '../utils/validation';

const router = Router();

// Public routes
router.get('/', videoController.getAllVideos);
router.get('/slug/:slug', videoController.getVideoBySlug);

// Protected routes (require authentication)
router.post('/', authenticate, validate(createVideoProjectSchema), videoController.createVideo);
router.get('/:id', authenticate, videoController.getVideoById);
router.put('/:id', authenticate, validate(updateVideoProjectSchema), videoController.updateVideo);
router.delete('/:id', authenticate, videoController.deleteVideo);
router.patch('/reorder', authenticate, videoController.reorderVideos);

export default router;
