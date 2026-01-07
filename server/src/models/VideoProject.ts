import mongoose, { Document, Schema } from 'mongoose';
import slugify from 'slugify';
import { ImageData } from '../types';

export interface IVideoProject extends Document {
  title: string;
  slug: string;
  category: string;
  year: string;
  description: string;
  role: string;
  thumbnail: ImageData;
  videoUrl: string;
  featured: boolean;
  order: number;
  status: 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const videoProjectSchema = new Schema<IVideoProject>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    year: {
      type: String,
      required: [true, 'Year is required'],
    },
    description: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    thumbnail: {
      url: {
        type: String,
        required: [true, 'Thumbnail URL is required'],
      },
      publicId: {
        type: String,
        default: '',
      },
      alt: {
        type: String,
        default: '',
      },
    },
    videoUrl: {
      type: String,
      required: [true, 'Video URL is required'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from title before saving
videoProjectSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    });
  }
  next();
});

// Index for faster queries
videoProjectSchema.index({ status: 1, order: 1 });
videoProjectSchema.index({ featured: 1 });

const VideoProject = mongoose.model<IVideoProject>('VideoProject', videoProjectSchema);

export default VideoProject;
