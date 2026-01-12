const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-vision-studio';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    // Use direct collection access
    const db = mongoose.connection.db;
    const settingsCollection = db.collection('settings');

    // Find the settings document
    const settings = await settingsCollection.findOne({});

    if (settings) {
      console.log('📝 Current settings has contactEmail?', !!settings.contactEmail);

      // Update directly at DB level
      const result = await settingsCollection.updateOne(
        {},
        { $set: { contactEmail: 'hello@aifilmmaker.com' } }
      );

      console.log('✅ Update result:', result.modifiedCount, 'document(s) modified');

      // Verify it was saved
      const updated = await settingsCollection.findOne({});
      console.log('✅ Verified contactEmail:', updated.contactEmail);
    } else {
      console.log('❌ No settings document found');
    }

    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
