import { Router } from 'express';
import * as blogController from '../controllers/blogController';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../utils/validation';
import { createBlogPostSchema, updateBlogPostSchema } from '../utils/validation';

const router = Router();

// Public routes
router.get('/', blogController.getAllPosts);
router.get('/featured', blogController.getFeaturedPosts);
router.get('/categories', blogController.getCategories);
router.get('/tags', blogController.getTags);
router.get('/slug/:slug', blogController.getPostBySlug);

// Protected routes (require authentication)
router.post('/', authenticate, validate(createBlogPostSchema), blogController.createPost);
router.get('/:id', authenticate, blogController.getPostById);
router.put('/:id', authenticate, validate(updateBlogPostSchema), blogController.updatePost);
router.delete('/:id', authenticate, blogController.deletePost);
router.patch('/:id/publish', authenticate, blogController.publishPost);

export default router;
