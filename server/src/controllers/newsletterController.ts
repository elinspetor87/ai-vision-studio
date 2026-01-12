import { Request, Response } from 'express';
import Newsletter from '../models/Newsletter';
import { sendNewsletterWelcomeEmail } from '../services/email.service';

export const newsletterController = {
    // Subscribe to newsletter
    subscribe: async (req: Request, res: Response) => {
        try {
            const { email, source } = req.body;

            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is required'
                });
            }

            // Check if email already exists
            const existingSubscriber = await Newsletter.findOne({ email });

            if (existingSubscriber) {
                if (existingSubscriber.isActive) {
                    return res.status(400).json({
                        success: false,
                        message: 'This email is already subscribed to our newsletter'
                    });
                } else {
                    // Reactivate subscription
                    existingSubscriber.isActive = true;
                    existingSubscriber.subscribedAt = new Date();

                    await existingSubscriber.save();

                    // Send welcome email (async)
                    sendNewsletterWelcomeEmail(email).catch(err => console.error('Error sending welcome email:', err));

                    return res.status(200).json({
                        success: true,
                        message: 'Welcome back! Your subscription has been reactivated.',
                        data: {
                            email: existingSubscriber.email,
                            subscribedAt: existingSubscriber.subscribedAt
                        }
                    });
                }
            }

            // Create new subscription
            const newSubscriber = new Newsletter({
                email,
                source: source || 'blog'
            });


            await newSubscriber.save();

            // Send welcome email (async)
            sendNewsletterWelcomeEmail(email).catch(err => console.error('Error sending welcome email:', err));

            return res.status(201).json({
                success: true,
                message: 'Successfully subscribed to our newsletter!',
                data: {
                    email: newSubscriber.email,
                    subscribedAt: newSubscriber.subscribedAt
                }
            });
        } catch (error: any) {
            console.error('Newsletter subscription error:', error);

            if (error.code === 11000) {
                return res.status(400).json({
                    success: false,
                    message: 'This email is already subscribed'
                });
            }

            if (error.name === 'ValidationError') {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Failed to subscribe. Please try again later.'
            });
        }
    },

    // Unsubscribe from newsletter
    unsubscribe: async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is required'
                });
            }

            const subscriber = await Newsletter.findOne({ email });

            if (!subscriber) {
                return res.status(404).json({
                    success: false,
                    message: 'Email not found in our newsletter list'
                });
            }

            subscriber.isActive = false;
            await subscriber.save();

            return res.status(200).json({
                success: true,
                message: 'Successfully unsubscribed from our newsletter'
            });
        } catch (error) {
            console.error('Newsletter unsubscribe error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to unsubscribe. Please try again later.'
            });
        }
    },

    // Get all subscribers (admin only)
    getAllSubscribers: async (req: Request, res: Response) => {
        try {
            const { page = 1, limit = 50, active } = req.query;

            const query: any = {};
            if (active !== undefined) {
                query.isActive = active === 'true';
            }

            const subscribers = await Newsletter.find(query)
                .sort({ subscribedAt: -1 })
                .limit(Number(limit))
                .skip((Number(page) - 1) * Number(limit))
                .select('-__v');

            const total = await Newsletter.countDocuments(query);

            return res.status(200).json({
                success: true,
                data: subscribers,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit))
                }
            });
        } catch (error) {
            console.error('Get subscribers error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch subscribers'
            });
        }
    },

    // Get subscriber count
    getCount: async (_req: Request, res: Response) => {
        try {
            const activeCount = await Newsletter.countDocuments({ isActive: true });
            const totalCount = await Newsletter.countDocuments();

            return res.status(200).json({
                success: true,
                data: {
                    active: activeCount,
                    total: totalCount,
                    inactive: totalCount - activeCount
                }
            });
        } catch (error) {
            console.error('Get count error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch subscriber count'
            });
        }
    }
};
