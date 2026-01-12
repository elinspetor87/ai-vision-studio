import { Router } from 'express';
import {
  getSocialMediaLinks,
  getAllSocialMediaLinks,
  createSocialMediaLink,
  updateSocialMediaLink,
  deleteSocialMediaLink,
  reorderSocialMediaLinks,
} from '../controllers/socialMediaController';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/public', getSocialMediaLinks);

// Protected routes (admin only)
router.use(authenticate);
router.get('/', getAllSocialMediaLinks);
router.post('/', createSocialMediaLink);
router.put('/:id', updateSocialMediaLink);
router.delete('/:id', deleteSocialMediaLink);
router.patch('/reorder', reorderSocialMediaLinks);

export default router;
