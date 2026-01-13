import { Request, Response, NextFunction } from 'express';
import VideoProject from '../models/VideoProject';
import { AppError, asyncHandler } from '../middleware/error.middleware';

// Get all video projects
export const getAllVideos = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status, featured } = req.query;

    const query: any = {};

    // Filter by status (default to active for public access)
    if (status && status !== 'all') {
      query.status = status;
    } else if (!status) {
      query.status = 'active';
    }
    // If status === 'all', don't filter by status at all

    if (featured === 'true') {
      query.featured = true;
    }

    const videos = await VideoProject.find(query).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: videos,
    });
  }
);

// Get single video by slug
export const getVideoBySlug = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;

    const video = await VideoProject.findOne({ slug });

    if (!video) {
      throw new AppError('Video project not found', 404);
    }

    res.status(200).json({
      success: true,
      data: video,
    });
  }
);

// Get single video by ID (for admin)
export const getVideoById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const video = await VideoProject.findById(id);

    if (!video) {
      throw new AppError('Video project not found', 404);
    }

    res.status(200).json({
      success: true,
      data: video,
    });
  }
);

// Create new video project
export const createVideo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const videoData = req.body;

    // Get the highest order number and add 1
    const maxOrder = await VideoProject.findOne().sort({ order: -1 }).select('order');
    if (maxOrder && videoData.order === undefined) {
      videoData.order = maxOrder.order + 1;
    }

    const video = await VideoProject.create(videoData);

    res.status(201).json({
      success: true,
      message: 'Video project created successfully',
      data: video,
    });
  }
);

// Update video project
export const updateVideo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const updateData = req.body;

    const video = await VideoProject.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: false,
    });

    if (!video) {
      throw new AppError('Video project not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Video project updated successfully',
      data: video,
    });
  }
);

// Delete video project
export const deleteVideo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    console.log(`🗑️ Attempting to delete video with ID: ${id}`);

    try {
      const video = await VideoProject.findByIdAndDelete(id);

      if (!video) {
        console.warn(`⚠️ Video not found for deletion: ${id}`);
        throw new AppError('Video project not found', 404);
      }

      console.log(`✅ Successfully deleted video: ${id} (${video.title})`);

      // TODO: Delete associated thumbnail from Cloudinary if needed

      res.status(200).json({
        success: true,
        message: 'Video project deleted successfully',
      });
    } catch (error) {
      console.error(`❌ Error deleting video ${id}:`, error);
      throw error;
    }
  }
);

// Reorder video projects
export const reorderVideos = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { videoIds } = req.body; // Array of video IDs in new order

    if (!Array.isArray(videoIds)) {
      throw new AppError('videoIds must be an array', 400);
    }

    // Update order for each video
    const updatePromises = videoIds.map((videoId, index) =>
      VideoProject.findByIdAndUpdate(videoId, { order: index })
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'Video projects reordered successfully',
    });
  }
);
