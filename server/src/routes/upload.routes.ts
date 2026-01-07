import { Router } from 'express';
import * as uploadController from '../controllers/uploadController';
import { authenticate } from '../middleware/auth.middleware';
import { uploadSingle } from '../middleware/upload.middleware';

const router = Router();

// All upload routes require authentication
router.post('/blog', authenticate, uploadSingle, uploadController.uploadBlogImage);
router.post('/film', authenticate, uploadSingle, uploadController.uploadFilmPoster);
router.post('/video', authenticate, uploadSingle, uploadController.uploadVideoThumbnail);
router.post('/image', authenticate, uploadSingle, uploadController.uploadImage);
router.delete('/:publicId', authenticate, uploadController.deleteImage);

export default router;
