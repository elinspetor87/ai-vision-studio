import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ContactSubmission from '../models/ContactSubmission';
import { sendTestEmail } from '../services/email.service';

dotenv.config();

const testContact = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-vision-studio';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Count total submissions
    const count = await ContactSubmission.countDocuments();
    console.log(`\n📊 Total contact submissions: ${count}`);

    // Get all submissions
    const submissions = await ContactSubmission.find().sort({ createdAt: -1 }).limit(10);
    console.log('\n📋 Recent submissions:');
    submissions.forEach((sub, index) => {
      console.log(`\n${index + 1}. ${sub.name} (${sub.email})`);
      console.log(`   Date: ${sub.date}`);
      console.log(`   Time: ${sub.time}`);
      console.log(`   Status: ${sub.status}`);
      console.log(`   Created: ${sub.createdAt}`);
    });

    // Test email
    console.log('\n\n📧 Testing email service...');
    const testEmailAddress = process.env.ADMIN_EMAIL || 'felipe.almeida.fx@gmail.com';
    await sendTestEmail(testEmailAddress);
    console.log(`✅ Test email sent to ${testEmailAddress}`);

    await mongoose.connection.close();
    console.log('\n✅ Test completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
};

testContact();
