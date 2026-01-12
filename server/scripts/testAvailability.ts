
import mongoose from 'mongoose';
import TimeSlotAvailability from '../src/models/TimeSlotAvailability';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || '');
        console.log('Connected to MongoDB');

        const date = new Date();
        date.setHours(0, 0, 0, 0);

        console.log('Trying to update/upsert availability for today:', date);

        const result = await TimeSlotAvailability.findOneAndUpdate(
            { date: date },
            {
                timeSlots: ['09:00 AM', '10:00 AM'],
                isBlocked: false,
                notes: 'Test script'
            },
            { new: true, upsert: true, runValidators: true }
        );

        console.log('Success:', result);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

test();
