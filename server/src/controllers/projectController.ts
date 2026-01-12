import { Request, Response, NextFunction } from 'express';
import Project from '../models/Project';
import { AppError, asyncHandler } from '../middleware/error.middleware';

// Get all projects
export const getAllProjects = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status, featured, category } = req.query;

    const query: any = {};

    // Filter by status (default to active for public access)
    if (status && status !== 'all') {
      query.status = status;
    } else if (!status) {
      query.status = 'active';
    }
    // If status === 'all', don't filter by status at all

    if (featured === 'true') {
      query.featured = true;
    }

    if (category) {
      query.category = category;
    }

    const projects = await Project.find(query).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: projects,
    });
  }
);

// Get single project by slug
export const getProjectBySlug = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;

    const project = await Project.findOne({ slug });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  }
);

// Get single project by ID (for admin)
export const getProjectById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  }
);

// Create new project
export const createProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const projectData = req.body;

    // Get the highest order number and add 1
    const maxOrder = await Project.findOne().sort({ order: -1 }).select('order');
    if (maxOrder && projectData.order === undefined) {
      projectData.order = maxOrder.order + 1;
    }

    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  }
);

// Update project
export const updateProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const updateData = req.body;

    const project = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: false,
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  }
);

// Delete project
export const deleteProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // TODO: Delete associated images from Cloudinary if needed

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  }
);

// Reorder projects
export const reorderProjects = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { projectIds } = req.body; // Array of project IDs in new order

    if (!Array.isArray(projectIds)) {
      throw new AppError('projectIds must be an array', 400);
    }

    // Update order for each project
    const updatePromises = projectIds.map((projectId, index) =>
      Project.findByIdAndUpdate(projectId, { order: index })
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'Projects reordered successfully',
    });
  }
);
