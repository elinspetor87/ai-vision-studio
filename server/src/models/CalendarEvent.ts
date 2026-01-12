import mongoose, { Document, Schema } from 'mongoose';

export interface ICalendarEvent extends Document {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  type: 'post_scheduled' | 'reminder' | 'deadline' | 'meeting' | 'other';
  relatedTo?: {
    type: 'blog' | 'film' | 'video' | 'comment';
    id: mongoose.Types.ObjectId;
  };
  location?: string;
  attendees?: string[];
  notificationSent: boolean;
  notifyBefore?: number; // Minutos antes de notificar
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

const calendarEventSchema = new Schema<ICalendarEvent>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [200, 'Title must be less than 200 characters'],
    },
    description: {
      type: String,
      maxlength: [1000, 'Description must be less than 1000 characters'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    allDay: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ['post_scheduled', 'reminder', 'deadline', 'meeting', 'other'],
      default: 'other',
    },
    relatedTo: {
      type: {
        type: String,
        enum: ['blog', 'film', 'video', 'comment'],
      },
      id: {
        type: Schema.Types.ObjectId,
      },
    },
    location: {
      type: String,
      trim: true,
    },
    attendees: {
      type: [String],
      default: [],
    },
    notificationSent: {
      type: Boolean,
      default: false,
    },
    notifyBefore: {
      type: Number, // em minutos
      default: 60, // 1 hora antes
    },
    color: {
      type: String,
      default: '#f97316', // laranja (cor primária)
    },
  },
  {
    timestamps: true,
  }
);

// Index para buscar eventos por data
calendarEventSchema.index({ startDate: 1, endDate: 1 });
calendarEventSchema.index({ type: 1 });

const CalendarEvent = mongoose.model<ICalendarEvent>('CalendarEvent', calendarEventSchema);

export default CalendarEvent;
