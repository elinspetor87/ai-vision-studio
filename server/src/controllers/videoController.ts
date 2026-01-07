import { Request, Response, NextFunction } from 'express';
import VideoProject from '../models/VideoProject';
import { AppError, asyncHandler } from '../middleware/error.middleware';

// Get all video projects
export const getAllVideos = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status = 'active', featured } = req.query;

    const query: any = { status };

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
      runValidators: true,
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

    const video = await VideoProject.findByIdAndDelete(id);

    if (!video) {
      throw new AppError('Video project not found', 404);
    }

    // TODO: Delete associated thumbnail from Cloudinary if needed

    res.status(200).json({
      success: true,
      message: 'Video project deleted successfully',
    });
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
