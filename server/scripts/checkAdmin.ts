
import mongoose from 'mongoose';
import User from '../src/models/User';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Load env vars
const PROD_URI = 'mongodb+srv://admin:VDUSOew6XrpSnK8b@ai-vision-studio.lh3f3rh.mongodb.net/?appName=ai-vision-studio';

const checkAdmin = async () => {
    try {
        console.log('📡 Connecting to PRODUCTION database...');
        await mongoose.connect(PROD_URI);
        console.log('✅ Connected.\n');

        const email = 'admin@example.com';
        let admin = await User.findOne({ email });

        if (!admin) {
            console.log('⚠️ Admin user NOT FOUND. Creating new admin...');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            admin = await User.create({
                name: 'Admin User',
                email,
                password: hashedPassword,
                role: 'admin',
            });
            console.log('✅ Admin user CREATED.');
        } else {
            console.log('✅ Admin user FOUND.');
            // Force reset password to be sure
            const hashedPassword = await bcrypt.hash('admin123', 10);
            admin.password = hashedPassword;
            await admin.save();
            console.log('🔄 Password RESET to "admin123".');
        }

        console.log(`\n📧 Login: ${email}`);
        console.log(`🔑 Password: admin123`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

checkAdmin();
