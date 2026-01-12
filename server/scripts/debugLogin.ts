
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const PROD_URI = 'mongodb+srv://admin:VDUSOew6XrpSnK8b@ai-vision-studio.lh3f3rh.mongodb.net/?appName=ai-vision-studio';

// Define the schema here to be 100% sure we are hitting the same structure
const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, default: 'admin' }
});

const User = mongoose.model('UserTemp', userSchema, 'users');

const debugLogin = async () => {
    try {
        console.log('📡 Connecting to PROD DB...');
        await mongoose.connect(PROD_URI);

        const email = 'admin@example.com';
        const rawPassword = 'admin123';

        const user = await User.findOne({ email });
        if (!user) {
            console.log('❌ User not found in "users" collection!');
            return;
        }

        console.log('✅ User found in DB.');
        console.log('🔐 Stored Hash:', user.password);

        const isMatch = await bcrypt.compare(rawPassword, user.password);
        console.log('🧪 Local bcrypt.compare result:', isMatch);

        if (!isMatch) {
            console.log('🔄 Re-hashing and updating password...');
            const newHash = await bcrypt.hash(rawPassword, 10);
            user.password = newHash;
            await user.save();
            console.log('✅ Password updated with new hash:', newHash);

            const reVerify = await bcrypt.compare(rawPassword, newHash);
            console.log('🧪 Immediate re-verify:', reVerify);
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
};

debugLogin();
