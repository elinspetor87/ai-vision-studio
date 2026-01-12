import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const checkAdmin = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-vision-studio';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    const users = await User.find();
    console.log(`\n📊 Total users: ${users.length}`);

    users.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.name} (${user.email})`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Created: ${user.createdAt}`);
    });

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkAdmin();
