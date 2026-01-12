import { Request, Response, NextFunction } from 'express';
import SocialMedia from '../models/SocialMedia';
import { AuthenticatedRequest } from '../types';
import { AppError, asyncHandler } from '../middleware/error.middleware';

// Get all social media links (public)
export const getSocialMediaLinks = asyncHandler(
  async (req: Request, res: Response) => {
    const links = await SocialMedia.find({ enabled: true }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: links,
    });
  }
);

// Get all social media links including disabled (admin only)
export const getAllSocialMediaLinks = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const links = await SocialMedia.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: links,
    });
  }
);

// Create social media link (admin only)
export const createSocialMediaLink = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const link = await SocialMedia.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Social media link created successfully',
      data: link,
    });
  }
);

// Update social media link (admin only)
export const updateSocialMediaLink = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const link = await SocialMedia.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!link) {
      throw new AppError('Social media link not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Social media link updated successfully',
      data: link,
    });
  }
);

// Delete social media link (admin only)
export const deleteSocialMediaLink = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const link = await SocialMedia.findByIdAndDelete(id);

    if (!link) {
      throw new AppError('Social media link not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Social media link deleted successfully',
    });
  }
);

// Reorder social media links (admin only)
export const reorderSocialMediaLinks = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { linkIds } = req.body; // Array of IDs in the new order

    if (!Array.isArray(linkIds)) {
      throw new AppError('linkIds must be an array', 400);
    }

    // Update order for each link
    await Promise.all(
      linkIds.map((id, index) =>
        SocialMedia.findByIdAndUpdate(id, { order: index })
      )
    );

    const links = await SocialMedia.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      message: 'Social media links reordered successfully',
      data: links,
    });
  }
);
