import { z } from 'zod';

// Authentication validation schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Blog Post validation schemas
export const createBlogPostSchema = z.object({
  title: z.string().min(5).max(200),
  excerpt: z.string().max(500),
  content: z.string().min(100),
  image: z.object({
    url: z.string().url(),
    publicId: z.string().optional(),
    alt: z.string().optional(),
  }),
  category: z.enum(['AI & Film', 'Workflow', 'Tutorial', 'Industry', 'Behind the Scenes']),
  tags: z.array(z.string()).max(10).optional(),
  readTime: z.string().optional(),
  featured: z.boolean().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    })
    .optional(),
});

export const updateBlogPostSchema = createBlogPostSchema.deepPartial();

// Film validation schemas
export const createFilmSchema = z.object({
  title: z.string().min(1),
  role: z.string().min(1),
  year: z.string().min(4).max(4),
  category: z.string().min(1),
  image: z.object({
    url: z.string().url(),
    publicId: z.string().optional(),
    alt: z.string().optional(),
  }),
  rating: z.string().optional(),
  description: z.string().optional(),
  imdbLink: z.string().url().optional().or(z.literal('')),
  showreelUrl: z.string().url().optional().or(z.literal('')),
  order: z.number().optional(),
  featured: z.boolean().optional(),
  status: z.enum(['active', 'archived']).optional(),
});

export const updateFilmSchema = createFilmSchema.deepPartial();

// Video Project validation schemas
export const createVideoProjectSchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  year: z.string().min(4).max(4),
  role: z.string().min(1),
  thumbnail: z.object({
    url: z.string().url(),
    publicId: z.string().optional(),
    alt: z.string().optional(),
  }),
  videoUrl: z.string().url(),
  description: z.string().optional(),
  order: z.number().optional(),
  featured: z.boolean().optional(),
  status: z.enum(['active', 'archived']).optional(),
});

export const updateVideoProjectSchema = createVideoProjectSchema.deepPartial();

// Project validation schemas
export const createProjectSchema = z.object({
  title: z.string().min(1),
  role: z.string().min(1),
  year: z.string().min(4).max(4),
  category: z.string().min(1),
  description: z.string().optional(),
  thumbnail: z.object({
    url: z.string().url(),
    publicId: z.string().optional(),
    alt: z.string().optional(),
  }),
  gallery: z.array(z.object({
    url: z.string().url(),
    publicId: z.string().optional(),
    alt: z.string().optional(),
  })).optional(),
  videoUrl: z.string().url().optional().or(z.literal('')),
  links: z.array(z.object({
    label: z.string().min(1),
    url: z.string().url(),
  })).optional(),
  order: z.number().optional(),
  featured: z.boolean().optional(),
  status: z.enum(['active', 'archived']).optional(),
});

export const updateProjectSchema = createProjectSchema.deepPartial();

// Contact Form validation schema
export const contactSubmissionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  date: z.string().or(z.date()),
  time: z.string().min(1, 'Time is required'),
  message: z.string().max(1000).optional().or(z.literal('')),
});

// Helper function to validate request body
export const validate = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};
