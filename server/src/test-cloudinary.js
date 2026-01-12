import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('Testing Cloudinary Configuration...\n');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? '✓ Set' : '✗ Not set');
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '✓ Set' : '✗ Not set');

// Test connection by listing resources
cloudinary.api.ping()
  .then(result => {
    console.log('\n✅ Cloudinary connection successful!');
    console.log('Response:', result);
    process.exit(0);
  })
  .catch(error => {
    console.log('\n❌ Cloudinary connection failed!');
    console.error('Error:', error.message);
    if (error.error && error.error.message) {
      console.error('Details:', error.error.message);
    }
    process.exit(1);
  });
