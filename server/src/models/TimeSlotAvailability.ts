import mongoose, { Document, Schema } from 'mongoose';

export interface ITimeSlotAvailability extends Document {
  date: Date; // Specific date to block
  timeSlots: string[]; // Available time slots for this date (empty = all blocked)
  isBlocked: boolean; // If true, entire day is blocked
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const timeSlotAvailabilitySchema = new Schema<ITimeSlotAvailability>(
  {
    date: {
      type: Date,
      required: [true, 'Date is required'],
      unique: true,
    },
    timeSlots: {
      type: [String],
      default: ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'],
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
// Index for faster queries
// Date is indexed by unique: true option above

const TimeSlotAvailability = mongoose.model<ITimeSlotAvailability>(
  'TimeSlotAvailability',
  timeSlotAvailabilitySchema
);

export default TimeSlotAvailability;
