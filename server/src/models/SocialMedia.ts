import mongoose, { Document, Schema } from 'mongoose';

export interface ISocialMedia extends Document {
  platform: string;
  username: string;
  url: string;
  icon: string;
  enabled: boolean;
  order: number;
  stats?: {
    followers?: number;
    lastUpdated?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const socialMediaSchema = new Schema<ISocialMedia>(
  {
    platform: {
      type: String,
      required: [true, 'Platform is required'],
      enum: ['Instagram', 'Twitter', 'LinkedIn', 'YouTube', 'TikTok', 'Facebook', 'Vimeo', 'Behance', 'ArtStation', 'IMDB', 'Website', 'Other'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true,
    },
    icon: {
      type: String,
      default: 'link',
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    stats: {
      followers: {
        type: Number,
        default: 0,
      },
      lastUpdated: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for ordering
socialMediaSchema.index({ order: 1, enabled: 1 });

const SocialMedia = mongoose.model<ISocialMedia>('SocialMedia', socialMediaSchema);

export default SocialMedia;
