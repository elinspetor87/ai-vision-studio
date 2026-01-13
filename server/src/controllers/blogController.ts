import { Request, Response, NextFunction } from 'express';
import BlogPost from '../models/BlogPost';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { BlogPostStatus } from '../types';

// Get all blog posts with pagination and filtering
export const getAllPosts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      featured,
      search,
    } = req.query;

    const query: any = {};

    // Filter by status (default to published for public access)
    if (status && status !== 'all') {
      query.status = status;
    } else if (!status) {
      query.status = BlogPostStatus.PUBLISHED;
    }
    // If status === 'all', don't filter by status at all

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by featured
    if (featured === 'true') {
      query.featured = true;
    }

    // Search by title or excerpt
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const posts = await BlogPost.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await BlogPost.countDocuments(query);

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  }
);

// Get featured blog posts
export const getFeaturedPosts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const posts = await BlogPost.find({
      status: BlogPostStatus.PUBLISHED,
      featured: true,
    })
      .sort({ publishedAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      data: posts,
    });
  }
);

// Get single blog post by slug
export const getPostBySlug = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;

    const post = await BlogPost.findOne({ slug });

    if (!post) {
      throw new AppError('Blog post not found', 404);
    }

    // Increment view count
    post.views += 1;
    await post.save();

    res.status(200).json({
      success: true,
      data: post,
    });
  }
);

// Get single blog post by ID (for admin)
export const getPostById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const post = await BlogPost.findById(id);

    if (!post) {
      throw new AppError('Blog post not found', 404);
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  }
);

// Create new blog post
export const createPost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log('📝 Creating new blog post');
    console.log('Post data:', JSON.stringify(req.body, null, 2));

    const postData = req.body;

    try {
      const post = await BlogPost.create(postData);
      console.log('✅ Blog post created:', post._id);

      res.status(201).json({
        success: true,
        message: 'Blog post created successfully',
        data: post,
      });
    } catch (error) {
      console.error('❌ Failed to create blog post:', error);
      throw error;
    }
  }
);

// Update blog post
export const updatePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log('📝 Updating blog post:', req.params.id);
    console.log('Update data:', JSON.stringify(req.body, null, 2));

    const { id } = req.params;
    const updateData = req.body;

    try {
      const post = await BlogPost.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: false,
      });

      if (!post) {
        console.error('❌ Blog post not found:', id);
        throw new AppError('Blog post not found', 404);
      }

      console.log('✅ Blog post updated:', post._id);

      res.status(200).json({
        success: true,
        message: 'Blog post updated successfully',
        data: post,
      });
    } catch (error) {
      console.error('❌ Failed to update blog post:', error);
      throw error;
    }
  }
);

// Delete blog post
export const deletePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    console.log(`🗑️ Attempting to delete blog post with ID: ${id}`);

    try {
      const post = await BlogPost.findByIdAndDelete(id);

      if (!post) {
        console.warn(`⚠️ Blog post not found for deletion: ${id}`);
        throw new AppError('Blog post not found', 404);
      }

      console.log(`✅ Successfully deleted blog post: ${id} (${post.title})`);

      // TODO: Delete associated image from Cloudinary if needed

      res.status(200).json({
        success: true,
        message: 'Blog post deleted successfully',
      });
    } catch (error) {
      console.error(`❌ Error deleting blog post ${id}:`, error);
      throw error;
    }
  }
);

// Publish a draft post
export const publishPost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const post = await BlogPost.findById(id);

    if (!post) {
      throw new AppError('Blog post not found', 404);
    }

    post.status = BlogPostStatus.PUBLISHED;
    post.publishedAt = new Date();
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Blog post published successfully',
      data: post,
    });
  }
);

// Get blog categories
export const getCategories = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const categories = await BlogPost.distinct('category');

    res.status(200).json({
      success: true,
      data: categories,
    });
  }
);

// Get blog tags
export const getTags = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const tags = await BlogPost.distinct('tags');

    res.status(200).json({
      success: true,
      data: tags,
    });
  }
);
