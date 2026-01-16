import { Request, Response, NextFunction } from 'express';
import CalendarEvent from '../models/CalendarEvent';
import TimeSlotAvailability from '../models/TimeSlotAvailability';
import { AuthenticatedRequest } from '../types';
import { AppError, asyncHandler } from '../middleware/error.middleware';

// Get all events
export const getEvents = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { start, end, type } = req.query;

    const filter: any = {};

    if (start && end) {
      filter.startDate = {
        $gte: new Date(start as string),
        $lte: new Date(end as string),
      };
    }

    if (type) {
      filter.type = type;
    }

    const events = await CalendarEvent.find(filter).sort({ startDate: 1 });

    res.status(200).json({
      success: true,
      data: events,
    });
  }
);

// Get single event
export const getEvent = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const event = await CalendarEvent.findById(id);

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  }
);

// Create event
export const createEvent = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const eventData = req.body;

    // Create event in database
    const event = await CalendarEvent.create(eventData);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event,
    });
  }
);

// Update event
export const updateEvent = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const updateData = req.body;

    const event = await CalendarEvent.findById(id);

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    // Update in database
    Object.assign(event, updateData);
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event,
    });
  }
);

// Delete event
export const deleteEvent = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const event = await CalendarEvent.findById(id);

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  }
);

// Send event reminder (removed - was Google Calendar specific)
// TODO: Implement email reminder system if needed

// Get upcoming events (next 7 days)
export const getUpcomingEvents = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const events = await CalendarEvent.find({
      startDate: {
        $gte: now,
        $lte: nextWeek,
      },
    }).sort({ startDate: 1 });

    res.status(200).json({
      success: true,
      data: events,
    });
  }
);

// Get available time slots for a specific date (PUBLIC)
export const getAvailableSlots = asyncHandler(
  async (req: Request, res: Response) => {
    const { date } = req.query;

    if (!date) {
      throw new AppError('Date is required', 400);
    }

    // Parse date ensuring UTC (YYYY-MM-DD -> T00:00:00.000Z)
    const [year, month, day] = (date as string).split('-').map(Number);
    const dateObj = new Date(Date.UTC(year, month - 1, day));
    // Removed setHours to prevent timezone shift

    // All possible time slots
    const allSlots = [
      '09:00 AM',
      '10:00 AM',
      '11:00 AM',
      '02:00 PM',
      '03:00 PM',
      '04:00 PM',
      '05:00 PM',
    ];

    // Check if there's a specific configuration for this date
    const availability = await TimeSlotAvailability.findOne({ date: dateObj });

    let availableSlots = allSlots;
    let isBlocked = false;

    if (availability) {
      if (availability.isBlocked) {
        availableSlots = [];
        isBlocked = true;
      } else {
        availableSlots = availability.timeSlots;
      }
    }

    const busySlots = allSlots.filter(slot => !availableSlots.includes(slot));

    res.status(200).json({
      success: true,
      data: {
        date,
        availableSlots,
        busySlots,
        isBlocked,
        totalSlots: allSlots.length,
        availableCount: availableSlots.length,
        notes: availability?.notes,
      },
    });
  }
);
