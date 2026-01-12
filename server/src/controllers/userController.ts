import { Response, NextFunction } from 'express';
import User from '../models/User';
import { AuthenticatedRequest } from '../types';
import { AppError, asyncHandler } from '../middleware/error.middleware';

// Get all users (admin only)
export const getAllUsers = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      data: users,
    });
  }
);

// Get single user (admin only)
export const getUserById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  }
);

// Update user (admin only)
export const updateUser = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, email, role, password, profilePicture } = req.body;

    const user = await User.findById(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (password) user.password = password; // Will be hashed by pre-save hook
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();

    // Return user without password
    const updatedUser = await User.findById(id).select('-password');

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  }
);

// Delete user (admin only)
export const deleteUser = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    // Prevent deleting yourself
    if (req.user?.id === id) {
      throw new AppError('You cannot delete your own account', 400);
    }

    const user = await User.findById(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  }
);
