import { Request, Response, NextFunction } from 'express';
import ContactSubmission from '../models/ContactSubmission';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import {
  sendContactNotificationToAdmin,
  sendContactConfirmationToUser,
} from '../services/email.service';

// Submit contact form (public endpoint)
export const submitContactForm = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, date, time, message } = req.body;

    // Get IP address and user agent for security
    const ipAddress = req.ip || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    // Create submission
    const submission = await ContactSubmission.create({
      name,
      email,
      date,
      time,
      message,
      ipAddress,
      userAgent,
      status: 'pending',
    });

    // Send emails asynchronously (don't wait for them to avoid timeouts)
    Promise.all([
      sendContactNotificationToAdmin({
        name,
        email,
        date,
        time,
        message,
      }),
      sendContactConfirmationToUser({
        name,
        email,
        date,
        time,
        message,
      }),
    ])
      .then(() => {
        console.log(`✅ Emails sent successfully for submission ${submission._id}`);
      })
      .catch((error) => {
        console.error('❌ Error sending emails (submission saved):', error);
      });

    res.status(201).json({
      success: true,
      message: 'Meeting request submitted successfully. Check your email for confirmation!',
      data: {
        id: submission._id,
        name: submission.name,
        email: submission.email,
        date: submission.date || null,
        time: submission.time || null,
      },
    });
  }
);

// Get all contact submissions (admin only)
export const getAllSubmissions = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status, page = 1, limit = 20 } = req.query;

    const query: any = {};

    if (status) {
      query.status = status;
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const submissions = await ContactSubmission.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await ContactSubmission.countDocuments(query);

    res.status(200).json({
      success: true,
      data: submissions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  }
);

// Get single submission by ID (admin only)
export const getSubmissionById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const submission = await ContactSubmission.findById(id);

    if (!submission) {
      throw new AppError('Contact submission not found', 404);
    }

    res.status(200).json({
      success: true,
      data: submission,
    });
  }
);

// Update submission status (admin only)
export const updateSubmissionStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      throw new AppError('Status is required', 400);
    }

    const submission = await ContactSubmission.findByIdAndUpdate(
      id,
      { status, notes },
      { new: true, runValidators: true }
    );

    if (!submission) {
      throw new AppError('Contact submission not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Submission status updated successfully',
      data: submission,
    });
  }
);

// Delete submission (admin only)
export const deleteSubmission = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const submission = await ContactSubmission.findByIdAndDelete(id);

    if (!submission) {
      throw new AppError('Contact submission not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Submission deleted successfully',
    });
  }
);

// Get submission statistics (admin only)
export const getSubmissionStats = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const stats = await ContactSubmission.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await ContactSubmission.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        total,
        byStatus: stats.reduce((acc: any, stat: any) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
      },
    });
  }
);
