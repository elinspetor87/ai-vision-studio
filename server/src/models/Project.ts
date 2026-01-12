import mongoose, { Document, Schema } from 'mongoose';
import slugify from 'slugify';
import { ImageData } from '../types';

export interface IProject extends Document {
  title: string;
  slug: string;
  role: string;
  year: string;
  category: string;
  description: string;
  thumbnail: ImageData;
  gallery: ImageData[];
  videoUrl: string;
  links: {
    label: string;
    url: string;
  }[];
  order: number;
  featured: boolean;
  status: 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
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
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    year: {
      type: String,
      required: [true, 'Year is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
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
    gallery: [
      {
        url: {
          type: String,
          required: true,
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
    ],
    videoUrl: {
      type: String,
      default: '',
    },
    links: [
      {
        label: {
          type: String,
          required: true,
          trim: true,
        },
        url: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    order: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
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
projectSchema.pre('save', function (next) {
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
projectSchema.index({ status: 1, order: 1 });
projectSchema.index({ featured: 1 });

const Project = mongoose.model<IProject>('Project', projectSchema);

export default Project;
