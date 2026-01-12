
import mongoose from 'mongoose';
import Newsletter from '../src/models/Newsletter';

const PROD_URI = 'mongodb+srv://admin:VDUSOew6XrpSnK8b@ai-vision-studio.lh3f3rh.mongodb.net/?appName=ai-vision-studio';

async function listSubscribers() {
    try {
        console.log('📡 Connecting to PRODUCTION database to list subscribers...');
        await mongoose.connect(PROD_URI);

        const subscribers = await Newsletter.find().sort({ subscribedAt: -1 }).limit(10);
        console.log(`📝 Recent Subscribers (${subscribers.length}):`);
        subscribers.forEach(s => {
            console.log(`   - [${s.email}] Active: ${s.isActive} | Date: ${s.subscribedAt}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

listSubscribers();
