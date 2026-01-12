
import mongoose from 'mongoose';
import SocialMedia from '../src/models/SocialMedia';

const PROD_URI = 'mongodb+srv://admin:VDUSOew6XrpSnK8b@ai-vision-studio.lh3f3rh.mongodb.net/?appName=ai-vision-studio';

async function diagSocialMedia() {
    try {
        console.log('📡 Connecting to PRODUCTION database to check social media...');
        await mongoose.connect(PROD_URI);
        console.log('✅ Connected.\n');

        const links = await SocialMedia.find().sort({ order: 1 });
        console.log(`🔗 Social Media Links (${links.length}):`);
        links.forEach(l => {
            console.log(`   - [${l.platform}] ${l.username} | URL: ${l.url} | Enabled: ${l.enabled}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

diagSocialMedia();
