
import mongoose from 'mongoose';
import Settings from '../src/models/Settings';

const PROD_URI = 'mongodb+srv://admin:VDUSOew6XrpSnK8b@ai-vision-studio.lh3f3rh.mongodb.net/?appName=ai-vision-studio';

async function checkEmailSettings() {
    try {
        console.log('📡 Connecting to PRODUCTION database to check email settings...');
        await mongoose.connect(PROD_URI);
        console.log('✅ Connected.\n');

        const settings = await Settings.findOne();
        if (settings) {
            console.log('✅ Settings document found.');
            const emailSettings = settings.emailSettings;
            if (emailSettings) {
                console.log('📧 Email Settings:');
                console.log(`   - Host: ${emailSettings.host || 'smtp.gmail.com'}`);
                console.log(`   - Port: ${emailSettings.port || 587}`);
                console.log(`   - User: ${emailSettings.user ? 'SET (***)' : 'NOT SET'}`);
                console.log(`   - Password: ${emailSettings.pass ? 'SET (***)' : 'NOT SET'}`);
                if (emailSettings.user) console.log(`   - Configured Email: ${emailSettings.user}`);
            } else {
                console.log('❌ No emailSettings field found in Settings document.');
            }

            console.log('\n🔧 Fallback Environment Vars (from your perspective):');
            console.log(`   - ADMIN_EMAIL: ${settings.contactEmail || 'Not in Settings'}`);
        } else {
            console.log('❌ No Settings document found at all.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

checkEmailSettings();
