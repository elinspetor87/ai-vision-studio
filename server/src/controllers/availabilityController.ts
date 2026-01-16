import { Request, Response, NextFunction } from 'express';
import TimeSlotAvailability from '../models/TimeSlotAvailability';
import { AuthenticatedRequest } from '../types';
import { AppError, asyncHandler } from '../middleware/error.middleware';

// Get all availability configurations (admin)
export const getAllAvailability = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { startDate, endDate } = req.query;

    const filter: any = {};

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    const availability = await TimeSlotAvailability.find(filter).sort({ date: 1 });

    res.status(200).json({
      success: true,
      data: availability,
    });
  }
);

// Get availability for a specific date (public)
export const getAvailabilityByDate = asyncHandler(
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

// Set availability for a specific date (admin)
export const setAvailability = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    console.log('📅 setAvailability called with:', JSON.stringify(req.body, null, 2));

    const { date, timeSlots, isBlocked, notes } = req.body;

    if (!date) {
      console.warn('❌ Date missing in setAvailability');
      throw new AppError('Date is required', 400);
    }

    // Handle date string to ensure correct Date object without timezone shift
    // We expect YYYY-MM-DD from frontend. We want YYYY-MM-DD T00:00:00.000 Z
    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(Date.UTC(year, month - 1, day));

    if (isNaN(dateObj.getTime())) {
      console.warn('❌ Invalid date format:', date);
      throw new AppError('Invalid date format', 400);
    }
    // Removed setHours to avoid local timezone interference

    console.log('🗓️ Processed Date (UTC):', dateObj.toISOString());

    // Upsert (update or insert)
    const availability = await TimeSlotAvailability.findOneAndUpdate(
      { date: dateObj },
      { timeSlots, isBlocked, notes },
      { new: true, upsert: true, runValidators: true }
    );

    console.log('✅ Availability updated/created:', availability?._id);

    res.status(200).json({
      success: true,
      message: 'Availability updated successfully',
      data: availability,
    });
  }
);

// Delete availability configuration (admin)
export const deleteAvailability = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const availability = await TimeSlotAvailability.findByIdAndDelete(id);

    if (!availability) {
      throw new AppError('Availability configuration not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Availability configuration deleted successfully',
    });
  }
);

// Reset to default (all slots available) for a specific date (admin)
export const resetAvailability = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { date } = req.body;

    if (!date) {
      throw new AppError('Date is required', 400);
    }

    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(Date.UTC(year, month - 1, day));

    await TimeSlotAvailability.findOneAndDelete({ date: dateObj });

    res.status(200).json({
      success: true,
      message: 'Availability reset to default (all slots available)',
    });
  }
);

// Copy availability from one date to multiple other dates (admin)
export const copyAvailability = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { sourceDate, targetDates } = req.body;

    if (!sourceDate || !targetDates || !Array.isArray(targetDates) || targetDates.length === 0) {
      throw new AppError('Source date and target dates are required', 400);
    }

    const [sYear, sMonth, sDay] = sourceDate.split('-').map(Number);
    const sourceDateObj = new Date(Date.UTC(sYear, sMonth - 1, sDay));

    // Get the source availability configuration
    const sourceAvailability = await TimeSlotAvailability.findOne({ date: sourceDateObj });

    if (!sourceAvailability) {
      throw new AppError('No configuration found for source date', 404);
    }

    // Copy to all target dates
    const operations = targetDates.map(async (targetDate: string) => {
      const [tYear, tMonth, tDay] = targetDate.split('-').map(Number);
      const targetDateObj = new Date(Date.UTC(tYear, tMonth - 1, tDay));

      return TimeSlotAvailability.findOneAndUpdate(
        { date: targetDateObj },
        {
          timeSlots: sourceAvailability.timeSlots,
          isBlocked: sourceAvailability.isBlocked,
          notes: sourceAvailability.notes,
        },
        { new: true, upsert: true, runValidators: true }
      );
    });

    await Promise.all(operations);

    res.status(200).json({
      success: true,
      message: `Availability copied to ${targetDates.length} date(s) successfully`,
      data: {
        copiedTo: targetDates.length,
      },
    });
  }
);
