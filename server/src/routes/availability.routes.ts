import { Router } from 'express';
import {
  getAllAvailability,
  getAvailabilityByDate,
  setAvailability,
  deleteAvailability,
  resetAvailability,
  copyAvailability,
} from '../controllers/availabilityController';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public route - check availability for a date
router.get('/check', getAvailabilityByDate);

// Protected routes (admin only)
router.use(authenticate);

router.get('/', getAllAvailability);
router.post('/', setAvailability);
router.post('/reset', resetAvailability);
router.post('/copy', copyAvailability);
router.delete('/:id', deleteAvailability);

export default router;
