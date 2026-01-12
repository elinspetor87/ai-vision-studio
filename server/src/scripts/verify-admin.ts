import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import bcrypt from 'bcrypt';

dotenv.config();

const verifyAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Database:', mongoose.connection.db?.databaseName);

    // Find admin user
    const admin = await User.findOne({ email: 'admin@example.com' }).select('+password');

    if (!admin) {
      console.log('❌ Admin user not found!');
      return;
    }

    console.log('\n📋 Admin User Info:');
    console.log('Email:', admin.email);
    console.log('Name:', admin.name);
    console.log('Role:', admin.role);
    console.log('Password hash length:', admin.password.length);
    console.log('Password hash starts with:', admin.password.substring(0, 7));

    // Test password
    const testPassword = 'admin123';
    console.log('\n🔍 Testing password:', testPassword);

    const isValid = await admin.comparePassword(testPassword);
    console.log('Password comparison result:', isValid ? '✅ VALID' : '❌ INVALID');

    // Manual bcrypt test
    const manualTest = await bcrypt.compare(testPassword, admin.password);
    console.log('Manual bcrypt test:', manualTest ? '✅ VALID' : '❌ INVALID');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

verifyAdmin();
