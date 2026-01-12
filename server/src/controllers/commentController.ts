import { Request, Response, NextFunction } from 'express';
import Comment from '../models/Comment';
import BlogPost from '../models/BlogPost';
import { AuthenticatedRequest } from '../types';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { sendEmail, emailTemplates } from '../utils/email';

// Get all comments for a blog post (public - only approved comments)
export const getCommentsByPost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;

    const comments = await Comment.find({
      blogPostId: postId,
      approved: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: comments,
    });
  }
);

// Get all comments (admin only - includes unapproved)
export const getAllComments = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { approved, postId } = req.query;

    const filter: any = {};
    if (approved !== undefined) {
      filter.approved = approved === 'true';
    }
    if (postId) {
      filter.blogPostId = postId;
    }

    const comments = await Comment.find(filter)
      .populate('blogPostId', 'title slug')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: comments,
    });
  }
);

// Create a new comment (public)
export const createComment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const { name, email, content } = req.body;

    // Check if blog post exists
    const post = await BlogPost.findById(postId);
    if (!post) {
      throw new AppError('Blog post not found', 404);
    }

    // Create comment
    const comment = await Comment.create({
      blogPostId: postId,
      name,
      email,
      content,
      approved: false, // Requires admin approval
    });

    // Send email notification to admin
    try {
      const emailTemplate = emailTemplates.newComment({
        postTitle: post.title,
        postSlug: post.slug,
        authorName: name,
        authorEmail: email,
        content: content,
      });

      await sendEmail({
        to: 'felipe.almeida.fx@gmail.com',
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });
    } catch (error) {
      console.error('Failed to send email notification:', error);
      // Don't fail the comment creation if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Comment submitted successfully! It will be visible after approval.',
      data: comment,
    });
  }
);

// Approve a comment (admin only)
export const approveComment = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const comment = await Comment.findByIdAndUpdate(
      id,
      { approved: true },
      { new: true }
    ).populate('blogPostId', 'title slug');

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    // Send email notification to comment author
    try {
      const post = comment.blogPostId as any;
      const emailTemplate = emailTemplates.commentApproved({
        postTitle: post.title,
        postSlug: post.slug,
        authorName: comment.name,
        authorEmail: comment.email,
      });

      await sendEmail({
        to: comment.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });
    } catch (error) {
      console.error('Failed to send approval email:', error);
      // Don't fail the approval if email fails
    }

    res.status(200).json({
      success: true,
      message: 'Comment approved successfully',
      data: comment,
    });
  }
);

// Delete a comment (admin only)
export const deleteComment = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const comment = await Comment.findByIdAndDelete(id);

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  }
);
