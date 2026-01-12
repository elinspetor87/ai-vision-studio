import { Request, Response, NextFunction } from 'express';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary';

// Upload blog image
export const uploadBlogImage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      throw new AppError('No image file provided', 400);
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, 'blog');

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      },
    });
  }
);

// Upload film poster
export const uploadFilmPoster = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      throw new AppError('No image file provided', 400);
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, 'posters');

    res.status(200).json({
      success: true,
      message: 'Poster uploaded successfully',
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      },
    });
  }
);

// Upload video thumbnail
export const uploadVideoThumbnail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      throw new AppError('No image file provided', 400);
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, 'thumbnails');

    res.status(200).json({
      success: true,
      message: 'Thumbnail uploaded successfully',
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      },
    });
  }
);

// Delete image from Cloudinary
export const deleteImage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { publicId } = req.params;

    if (!publicId) {
      throw new AppError('Public ID is required', 400);
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(publicId);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
    });
  }
);

// Upload general image (for any purpose)
export const uploadImage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log('📸 Upload request received');
    console.log('File:', req.file ? 'Present' : 'Missing');
    console.log('Body:', req.body);

    if (!req.file) {
      console.error('❌ No file in request');
      throw new AppError('No image file provided', 400);
    }

    const { folder = 'general' } = req.body;
    console.log(`📁 Uploading to folder: ${folder}`);

    try {
      // Upload to Cloudinary
      const result = await uploadToCloudinary(req.file.buffer, folder);
      console.log('✅ Upload successful:', result.public_id);

      res.status(200).json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
        },
      });
    } catch (error) {
      console.error('❌ Upload failed:', error);
      throw error;
    }
  }
);
