import { Request, Response, NextFunction } from 'express';
import Film from '../models/Film';
import { AppError, asyncHandler } from '../middleware/error.middleware';

// Get all films
export const getAllFilms = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status = 'active', featured } = req.query;

    const query: any = { status };

    if (featured === 'true') {
      query.featured = true;
    }

    const films = await Film.find(query).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: films,
    });
  }
);

// Get single film by slug
export const getFilmBySlug = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;

    const film = await Film.findOne({ slug });

    if (!film) {
      throw new AppError('Film not found', 404);
    }

    res.status(200).json({
      success: true,
      data: film,
    });
  }
);

// Get single film by ID (for admin)
export const getFilmById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const film = await Film.findById(id);

    if (!film) {
      throw new AppError('Film not found', 404);
    }

    res.status(200).json({
      success: true,
      data: film,
    });
  }
);

// Create new film
export const createFilm = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const filmData = req.body;

    // Get the highest order number and add 1
    const maxOrder = await Film.findOne().sort({ order: -1 }).select('order');
    if (maxOrder && filmData.order === undefined) {
      filmData.order = maxOrder.order + 1;
    }

    const film = await Film.create(filmData);

    res.status(201).json({
      success: true,
      message: 'Film created successfully',
      data: film,
    });
  }
);

// Update film
export const updateFilm = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const updateData = req.body;

    const film = await Film.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!film) {
      throw new AppError('Film not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Film updated successfully',
      data: film,
    });
  }
);

// Delete film
export const deleteFilm = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const film = await Film.findByIdAndDelete(id);

    if (!film) {
      throw new AppError('Film not found', 404);
    }

    // TODO: Delete associated image from Cloudinary if needed

    res.status(200).json({
      success: true,
      message: 'Film deleted successfully',
    });
  }
);

// Reorder films
export const reorderFilms = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { filmIds } = req.body; // Array of film IDs in new order

    if (!Array.isArray(filmIds)) {
      throw new AppError('filmIds must be an array', 400);
    }

    // Update order for each film
    const updatePromises = filmIds.map((filmId, index) =>
      Film.findByIdAndUpdate(filmId, { order: index })
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'Films reordered successfully',
    });
  }
);
