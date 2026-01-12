import { Router } from 'express';
import * as projectController from '../controllers/projectController';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../utils/validation';
import { createProjectSchema, updateProjectSchema } from '../utils/validation';

const router = Router();

// Public routes
router.get('/', projectController.getAllProjects);
router.get('/slug/:slug', projectController.getProjectBySlug);

// Protected routes (require authentication)
router.post('/', authenticate, validate(createProjectSchema), projectController.createProject);
router.get('/:id', authenticate, projectController.getProjectById);
router.put('/:id', authenticate, validate(updateProjectSchema), projectController.updateProject);
router.delete('/:id', authenticate, projectController.deleteProject);
router.patch('/reorder', authenticate, projectController.reorderProjects);

export default router;
