
import mongoose from 'mongoose';
import SocialMedia from '../src/models/SocialMedia';

const PROD_URI = 'mongodb+srv://admin:VDUSOew6XrpSnK8b@ai-vision-studio.lh3f3rh.mongodb.net/?appName=ai-vision-studio';

async function testCreateSocialMedia() {
    try {
        console.log('📡 Connecting to PRODUCTION database to test creation...');
        await mongoose.connect(PROD_URI);
        console.log('✅ Connected.\n');

        const testData = {
            platform: 'Instagram',
            username: '@felipealmeida',
            url: 'https://instagram.com/felipealmeida',
            enabled: true
        };

        console.log('📝 Attempting to create social media link:', testData);
        const link = await SocialMedia.create(testData);
        console.log('✅ Success! Created Link:', link);

        // Cleanup
        // await SocialMedia.findByIdAndDelete(link._id);
        // console.log('🧹 Cleanup: Deleted test link.');

    } catch (error: any) {
        console.error('❌ FAILED:');
        console.error('   - Message:', error.message);
        if (error.errors) {
            console.error('   - Validation Errors:', JSON.stringify(error.errors, null, 2));
        }
    } finally {
        await mongoose.disconnect();
    }
}

testCreateSocialMedia();
