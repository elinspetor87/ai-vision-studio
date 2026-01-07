import mongoose, { Document, Schema } from 'mongoose';
import slugify from 'slugify';
import { BlogPostStatus, ImageData } from '../types';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: ImageData;
  category: string;
  tags: string[];
  readTime: string;
  publishedAt?: Date;
  status: BlogPostStatus;
  featured: boolean;
  views: number;
  author: {
    name: string;
    avatar?: string;
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const blogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [200, 'Title must be less than 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      maxlength: [500, 'Excerpt must be less than 500 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      minlength: [100, 'Content must be at least 100 characters'],
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
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['AI & Film', 'Workflow', 'Tutorial', 'Industry', 'Behind the Scenes'],
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags: string[]) {
          return tags.length <= 10;
        },
        message: 'Maximum 10 tags allowed',
      },
    },
    readTime: {
      type: String,
      default: '5 min read',
    },
    publishedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: Object.values(BlogPostStatus),
      default: BlogPostStatus.DRAFT,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    author: {
      name: {
        type: String,
        default: 'AI Vision Studio',
      },
      avatar: {
        type: String,
        default: '',
      },
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from title before saving
blogPostSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    });
  }

  // Auto-set publishedAt when status changes to published
  if (this.isModified('status') && this.status === BlogPostStatus.PUBLISHED && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

// Index for faster queries
blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ category: 1 });
blogPostSchema.index({ featured: 1 });

const BlogPost = mongoose.model<IBlogPost>('BlogPost', blogPostSchema);

export default BlogPost;
