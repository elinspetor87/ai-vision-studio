# AI Vision Studio - Backend API

Node.js + Express + TypeScript backend for the AI Vision Studio content management system.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Image Storage:** Cloudinary
- **Email:** Nodemailer (Gmail SMTP)
- **Validation:** Zod
- **Security:** Helmet, CORS, Rate Limiting

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB installed locally OR MongoDB Atlas account
- Cloudinary account (for image uploads)
- Gmail account (for email notifications)

### Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your credentials

```bash
cp .env.example .env
```

### Environment Variables

Update the following in your `.env` file:

#### MongoDB
- For local MongoDB: `mongodb://localhost:27017/ai-vision-studio`
- For MongoDB Atlas: Get connection string from your Atlas dashboard

#### Cloudinary
1. Create account at [cloudinary.com](https://cloudinary.com)
2. Get credentials from Dashboard > Settings
3. Update: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

#### Gmail SMTP
1. Enable 2-Factor Authentication on your Gmail account
2. Generate App Password: Account > Security > App passwords
3. Update: `EMAIL_USER` (your email), `EMAIL_APP_PASSWORD` (app password)

### Running the Server

**Development mode (with hot reload):**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
npm start
```

The server will start on `http://localhost:5000`

## Project Structure

```
server/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.ts      # MongoDB connection
│   │   ├── cloudinary.ts    # Cloudinary setup
│   │   └── environment.ts   # Environment variables
│   │
│   ├── models/              # Mongoose schemas
│   │   ├── User.ts          # Admin user model
│   │   ├── BlogPost.ts      # Blog post model
│   │   ├── Film.ts          # Film gallery model
│   │   ├── VideoProject.ts  # Video project model
│   │   └── ContactSubmission.ts # Contact form model
│   │
│   ├── routes/              # API route definitions
│   │   ├── auth.routes.ts   # Authentication routes
│   │   ├── blog.routes.ts   # Blog CRUD routes
│   │   ├── film.routes.ts   # Film CRUD routes
│   │   ├── video.routes.ts  # Video CRUD routes
│   │   ├── contact.routes.ts # Contact form routes
│   │   └── upload.routes.ts # Image upload routes
│   │
│   ├── controllers/         # Request handlers (to be implemented)
│   ├── middleware/          # Express middleware
│   │   └── error.middleware.ts # Error handling
│   ├── services/            # Business logic (to be implemented)
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript types & interfaces
│   │   └── index.ts
│   │
│   ├── app.ts               # Express app configuration
│   └── server.ts            # Server entry point
│
├── .env                     # Environment variables (gitignored)
├── .env.example             # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## API Endpoints

### Health Check
- `GET /health` - Server health check

### Authentication (To be implemented)
- `POST /api/auth/register` - Create admin user
- `POST /api/auth/login` - Login (returns JWT token)
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Blog Posts (To be implemented)
- `GET /api/blog` - Get all posts
- `GET /api/blog/featured` - Get featured posts
- `GET /api/blog/:slug` - Get post by slug
- `POST /api/blog` - Create post (protected)
- `PUT /api/blog/:id` - Update post (protected)
- `DELETE /api/blog/:id` - Delete post (protected)

### Films (To be implemented)
- `GET /api/films` - Get all films
- `GET /api/films/:slug` - Get film by slug
- `POST /api/films` - Create film (protected)
- `PUT /api/films/:id` - Update film (protected)
- `DELETE /api/films/:id` - Delete film (protected)

### Video Projects (To be implemented)
- `GET /api/videos` - Get all videos
- `GET /api/videos/:slug` - Get video by slug
- `POST /api/videos` - Create video (protected)
- `PUT /api/videos/:id` - Update video (protected)
- `DELETE /api/videos/:id` - Delete video (protected)

### Contact Form (To be implemented)
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all submissions (protected)
- `PATCH /api/contact/:id/status` - Update status (protected)

### Image Upload (To be implemented)
- `POST /api/upload/blog` - Upload blog image (protected)
- `POST /api/upload/film` - Upload film poster (protected)
- `POST /api/upload/video` - Upload video thumbnail (protected)
- `DELETE /api/upload/:publicId` - Delete image (protected)

## Database Models

### User
- Email, password (hashed), name, role, lastLogin
- Methods: comparePassword()

### BlogPost
- Title, slug, excerpt, content, image, category, tags
- Status: draft | published | archived
- SEO fields, view count, featured flag
- Auto-generates slug from title

### Film
- Title, slug, role, year, category, image
- Rating, description, IMDB link, showreel URL
- Order (for sorting), featured flag

### VideoProject
- Title, slug, category, year, description, role
- Thumbnail, video URL, order, featured flag

### ContactSubmission
- Name, email, date, time, message
- Status: pending | contacted | completed | cancelled
- Notes, IP address, user agent

## Development Roadmap

### Current Status ✅
- [x] Project structure set up
- [x] Express server configured
- [x] MongoDB connection ready
- [x] All Mongoose models created
- [x] Error handling middleware
- [x] CORS and security configured

### Next Steps
- [ ] Implement JWT authentication
- [ ] Create controllers for all endpoints
- [ ] Add validation middleware
- [ ] Implement email service
- [ ] Set up Multer for file uploads
- [ ] Create seed script for initial data
- [ ] Build admin panel
- [ ] Deploy to production

## Testing

Use tools like Postman, Insomnia, or Thunder Client to test API endpoints.

### Example: Health Check
```bash
curl http://localhost:5000/health
```

Response:
```json
{
  "success": true,
  "message": "AI Vision Studio API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

## Security Features

- Helmet.js for secure HTTP headers
- CORS configured for specific origins
- Rate limiting (100 requests per 15 minutes)
- Password hashing with bcrypt (12 rounds)
- JWT token authentication
- Input validation with Zod
- MongoDB injection prevention via Mongoose

## Deployment

### MongoDB Atlas Setup
1. Create free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Whitelist IPs (use `0.0.0.0/0` for cloud deployment)
4. Get connection string and update `MONGODB_URI`

### Deployment Platforms
- **Railway**: Easy deployment, good free tier
- **Render**: Free tier available
- **Fly.io**: Great for Node.js apps
- **Heroku**: Classic platform (paid)
- **DigitalOcean App Platform**: Simple deployment

## License

ISC

## Author

AI Vision Studio
