import mongoose, { Document, Schema } from 'mongoose';
import slugify from 'slugify';
import { ImageData } from '../types';

export interface IFilm extends Document {
  title: string;
  slug: string;
  role: string;
  year: string;
  category: string;
  image: ImageData;
  rating: string;
  description: string;
  imdbLink?: string;
  showreelUrl?: string;
  order: number;
  featured: boolean;
  status: 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const filmSchema = new Schema<IFilm>(
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
    image: {
      url: {
        type: String,
        required: [true, 'Image URL is required'],
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
    rating: {
      type: String,
      default: '—',
    },
    description: {
      type: String,
      default: '',
    },
    imdbLink: {
      type: String,
      default: '',
    },
    showreelUrl: {
      type: String,
      default: '',
    },
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
filmSchema.pre('save', function (next) {
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
filmSchema.index({ status: 1, order: 1 });
filmSchema.index({ featured: 1 });

const Film = mongoose.model<IFilm>('Film', filmSchema);

export default Film;
