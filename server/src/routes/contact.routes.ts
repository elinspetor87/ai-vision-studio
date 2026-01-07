import { Router } from 'express';
import * as contactController from '../controllers/contactController';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../utils/validation';
import { contactSubmissionSchema } from '../utils/validation';

const router = Router();

// Public route
router.post('/', validate(contactSubmissionSchema), contactController.submitContactForm);

// Protected routes (require authentication)
router.get('/', authenticate, contactController.getAllSubmissions);
router.get('/stats', authenticate, contactController.getSubmissionStats);
router.get('/:id', authenticate, contactController.getSubmissionById);
router.patch('/:id/status', authenticate, contactController.updateSubmissionStatus);
router.delete('/:id', authenticate, contactController.deleteSubmission);

export default router;
