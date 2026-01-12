import { Router } from 'express';
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getUpcomingEvents,
  getAvailableSlots,
} from '../controllers/calendarController';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes (no authentication required)
router.get('/available-slots', getAvailableSlots);

// All other routes require authentication
router.use(authenticate);

router.get('/', getEvents);
router.get('/upcoming', getUpcomingEvents);
router.get('/:id', getEvent);
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

export default router;
