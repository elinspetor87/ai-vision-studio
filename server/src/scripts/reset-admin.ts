import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from '../config/database';
import User from '../models/User';

const resetAdmin = async () => {
  try {
    await connectDB();
    console.log('📊 Resetting admin user...\n');

    // Delete all existing admin users
    const deleted = await User.deleteMany({ email: 'admin@example.com' });
    console.log(`🗑️  Deleted ${deleted.deletedCount} existing admin user(s)`);

    // Create fresh admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });

    console.log('\n✅ New admin user created successfully!');
    console.log('📧 Email: admin@example.com');
    console.log('🔑 Password: admin123');
    console.log('\nYou can now login with these credentials.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting admin:', error);
    process.exit(1);
  }
};

resetAdmin();
