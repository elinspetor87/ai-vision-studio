import mongoose, { Schema, Document } from 'mongoose';

export interface INewsletter extends Document {
    email: string;
    subscribedAt: Date;
    isActive: boolean;
    source?: string; // 'blog', 'homepage', etc.
}

const NewsletterSchema: Schema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address'
        ]
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    source: {
        type: String,
        default: 'blog'
    }
}, {
    timestamps: true
});

// Index for faster queries
NewsletterSchema.index({ isActive: 1 });

export default mongoose.model<INewsletter>('Newsletter', NewsletterSchema);
