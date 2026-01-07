import { Router } from 'express';
import * as filmController from '../controllers/filmController';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../utils/validation';
import { createFilmSchema, updateFilmSchema } from '../utils/validation';

const router = Router();

// Public routes
router.get('/', filmController.getAllFilms);
router.get('/slug/:slug', filmController.getFilmBySlug);

// Protected routes (require authentication)
router.post('/', authenticate, validate(createFilmSchema), filmController.createFilm);
router.get('/:id', authenticate, filmController.getFilmById);
router.put('/:id', authenticate, validate(updateFilmSchema), filmController.updateFilm);
router.delete('/:id', authenticate, filmController.deleteFilm);
router.patch('/reorder', authenticate, filmController.reorderFilms);

export default router;
