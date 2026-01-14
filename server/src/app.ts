// Version 1.0.5 - Triggering build for social media and rate limit fixes
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env, isDevelopment } from './config/environment';

// Import middleware (will be created)
import { errorHandler } from './middleware/error.middleware';

// Import routes (will be created)
import authRoutes from './routes/auth.routes';
import blogRoutes from './routes/blog.routes';
import filmRoutes from './routes/film.routes';
import videoRoutes from './routes/video.routes';
import projectRoutes from './routes/project.routes';
import uploadRoutes from './routes/upload.routes';
import settingsRoutes from './routes/settings.routes';
import userRoutes from './routes/user.routes';
import commentRoutes from './routes/comment.routes';
import socialMediaRoutes from './routes/socialMedia.routes';
import calendarRoutes from './routes/calendar.routes';
import contactRoutes from './routes/contact.routes';
import availabilityRoutes from './routes/availability.routes';
import newsletterRoutes from './routes/newsletter';
import sitemapRoutes from './routes/sitemap.routes';

const app: Application = express();

// Request logger
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`📡 ${new Date().toISOString()} | ${req.method} ${req.originalUrl}`);
  next();
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Vite/React handling
  crossOriginEmbedderPolicy: false,
  frameguard: { action: 'deny' }, // Prevent clickjacking
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }, // Force HTTPS
}));

// Trust proxy (for Nginx)
app.set('trust proxy', 1);

// CORS configuration
const allowedOrigins = isDevelopment ? true : [
  env.CLIENT_URL,
  env.ADMIN_URL,
  'https://ai-vision-studio.vercel.app',
  'https://www.felipealmeida.studio',
  'https://felipealmeida.studio'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // 1. Allow development or no-origin (mobile/curl)
    if (!origin || isDevelopment) return callback(null, true);

    // 2. Normalize origin
    const normalizedOrigin = origin.toLowerCase().trim();

    // 3. Allow all Vercel preview URLs and main domains
    const isAuthorized =
      normalizedOrigin.includes('felipealmeida.studio') ||
      normalizedOrigin.includes('vercel.app') ||  // Allow all Vercel preview URLs
      (Array.isArray(allowedOrigins) && allowedOrigins.some(o =>
        typeof o === 'string' && o.toLowerCase().includes(normalizedOrigin.replace('https://', '').replace('http://', ''))
      ));

    if (isAuthorized) {
      return callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked for origin: ${origin}`);
      return callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'Cache-Control'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '500', 10), // Aumentado para 500 para evitar 429 em admin
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

if (!isDevelopment) {
  app.use('/api', limiter);
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'AI Vision Studio API is running',
    version: 'v1.1.3-cors-debug',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/films', filmRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/social-media', socialMediaRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Sitemap route (must be before 404 handler)
app.use('/', sitemapRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
  });
});

// Global error handler
app.use(errorHandler);

// Log all routes in development
if (isDevelopment) {
  console.log('\n📋 Registered Routes:');
  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      console.log(`  ${Object.keys(middleware.route.methods)[0].toUpperCase()} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler: any) => {
        if (handler.route) {
          const path = middleware.regexp.source
            .replace('\\/?', '')
            .replace('(?=\\/|$)', '')
            .replace(/\\\//g, '/');
          console.log(`  ${Object.keys(handler.route.methods)[0].toUpperCase()} ${path}${handler.route.path}`);
        }
      });
    }
  });
  console.log('\n');
}

export default app;
