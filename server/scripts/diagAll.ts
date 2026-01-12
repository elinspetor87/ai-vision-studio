
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Settings from '../src/models/Settings';
import VideoProject from '../src/models/VideoProject';
import TimeSlotAvailability from '../src/models/TimeSlotAvailability';
import BlogPost from '../src/models/BlogPost';
import path from 'path';

// Load environment variables manually for the script
const PROD_URI = 'mongodb+srv://admin:VDUSOew6XrpSnK8b@ai-vision-studio.lh3f3rh.mongodb.net/?appName=ai-vision-studio';

const diagnose = async () => {
    try {
        console.log('📡 Connecting to PRODUCTION database...');
        await mongoose.connect(PROD_URI);
        console.log('✅ Connected.\n');

        // 1. Settings
        const settings = await Settings.findOne();
        if (settings) {
            console.log(`✅ SETTINGS: Found.`);
            console.log(`   - Updated At: ${settings.updatedAt}`);
            console.log(`   - Profile Image: ${settings.profileImage?.url ? 'Set' : 'Empty'}`);
            console.log(`   - Logo Text: ${settings.logoText}`);
            console.log(`   - Contact Email: ${settings.contactEmail}`);
            console.log(`   - Hero Tagline: ${settings.heroSection?.tagline || 'UNDEFINED'}`);
            console.log(`   - Hero Line 1: ${settings.heroSection?.line1 || 'UNDEFINED'}`);
        } else {
            console.log(`❌ SETTINGS: NOT FOUND (Empty)`);
        }

        // 2. Videos
        const videos = await VideoProject.find({});
        console.log(`\n🎥 VIDEOS: Found ${videos.length} videos.`);
        videos.forEach(v => console.log(`   - [${v.title}] (Featured: ${v.featured})`));

        // 3. Availability
        const availability = await TimeSlotAvailability.find({});
        console.log(`\n📅 AVAILABILITY: Found ${availability.length} slots configured.`);
        availability.forEach(a => console.log(`   - [${a.date.toISOString().split('T')[0]}] Blocked: ${a.isBlocked}`));

        // 4. Blog Posts
        const posts = await BlogPost.countDocuments({});
        console.log(`\n📝 BLOG POSTS: Found ${posts} posts.`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

diagnose();
