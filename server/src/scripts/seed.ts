import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from '../config/database';
import User from '../models/User';

const seedAdmin = async () => {
  try {
    await connectDB();
    console.log('📊 Starting database seed...\n');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });

    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('📧 Email: admin@example.com');
      console.log('🔑 Password: admin123\n');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@example.com');
    console.log('🔑 Password: admin123');
    console.log('\n⚠️  Please change the password after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedAdmin();
