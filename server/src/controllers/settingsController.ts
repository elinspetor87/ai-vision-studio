import { Request, Response, NextFunction } from 'express';
import Settings from '../models/Settings';
import { AppError, asyncHandler } from '../middleware/error.middleware';

// Get settings
export const getSettings = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let settings = await Settings.findOne();

    // Create default settings if none exist
    if (!settings) {
      settings = await Settings.create({});
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  }
);

// Update settings
export const updateSettings = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log('⚙️ Updating settings');
    console.log('Update data:', JSON.stringify(req.body, null, 2));

    const updateData = req.body;

    let settings = await Settings.findOne();

    if (!settings) {
      console.log('📝 Creating new settings document');
      // Create if doesn't exist
      settings = await Settings.create(updateData);
    } else {
      console.log('📝 Updating existing settings');
      // Merge update to preserve existing fields
      Object.keys(updateData).forEach(key => {
        (settings as any)[key] = updateData[key];
        // Ensure Mongoose detects changes in nested objects
        if (typeof updateData[key] === 'object' && updateData[key] !== null) {
          settings?.markModified(key);
        }
      });
      await settings.save();
    }

    console.log('✅ Settings saved:', {
      logoText: settings?.logoText,
      contactEmail: settings?.contactEmail,
      logoUrl: settings?.logo?.url,
      faviconUrl: settings?.favicon?.url,
    });

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: settings,
    });
  }
);

// Generate new API Key
export const generateApiKey = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { label } = req.body;
    const crypto = require('crypto');

    // Generate a secure random key
    const key = `ak_${crypto.randomBytes(24).toString('hex')}`;

    const settings = await Settings.findOne();
    if (!settings) throw new AppError('Settings not initialized', 400);

    // Initialize array if undefined
    if (!settings.apiKeys) settings.apiKeys = [];

    settings.apiKeys.push({
      key, // In a real prod app, you might want to hash this
      label: label || 'New API Key',
      createdAt: new Date()
    });

    await settings.save();

    res.status(201).json({
      success: true,
      message: 'API Key generated successfully',
      data: {
        key, // Return to user one-time
        label: label || 'New API Key'
      }
    });
  }
);

// Revoke API Key
export const revokeApiKey = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { key } = req.params;

    const settings = await Settings.findOne();
    if (!settings || !settings.apiKeys) {
      throw new AppError('Settings not found', 404);
    }

    settings.apiKeys = settings.apiKeys.filter((k: any) => k.key !== key);
    await settings.save();

    res.status(200).json({
      success: true,
      message: 'API Key revoked successfully',
      data: settings.apiKeys
    });
  }
);
