import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  blogPostId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  content: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    blogPostId: {
      type: Schema.Types.ObjectId,
      ref: 'BlogPost',
      required: [true, 'Blog post ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name must be less than 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
      minlength: [3, 'Comment must be at least 3 characters'],
      maxlength: [1000, 'Comment must be less than 1000 characters'],
    },
    approved: {
      type: Boolean,
      default: false, // Comments need approval by default
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
commentSchema.index({ blogPostId: 1, approved: 1 });
commentSchema.index({ createdAt: -1 });

const Comment = mongoose.model<IComment>('Comment', commentSchema);

export default Comment;
