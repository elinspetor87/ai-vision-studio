import { Router } from 'express';
import * as contactController from '../controllers/contactController';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../utils/validation';
import { contactSubmissionSchema } from '../utils/validation';

const router = Router();

// Public routes
router.post('/', validate(contactSubmissionSchema), contactController.submitContactForm);

// Temporary test route (no auth) - REMOVE IN PRODUCTION
router.get('/test-list', contactController.getAllSubmissions);

// Protected routes (require authentication) - specific routes must come before /:id
router.get('/stats', authenticate, contactController.getSubmissionStats);
router.get('/', authenticate, contactController.getAllSubmissions);
router.get('/:id', authenticate, contactController.getSubmissionById);
router.patch('/:id/status', authenticate, contactController.updateSubmissionStatus);
router.delete('/:id', authenticate, contactController.deleteSubmission);

export default router;
