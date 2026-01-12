# Getting Started with AI Vision Studio Backend

This guide will help you set up and run the backend API for your AI Vision Studio project.

## ✅ Prerequisites

Before starting, make sure you have:

- [x] Node.js 18+ installed
- [x] MongoDB installed locally OR MongoDB Atlas account
- [x] Cloudinary account (for image uploads)
- [x] Gmail account with App Password (for emails)

---

## 📦 Step 1: Install Dependencies

Navigate to the server directory and install all required packages:

```bash
cd server
npm install
```

This will install all dependencies listed in `package.json`.

---

## 🔧 Step 2: Configure Environment Variables

The `.env` file has been created for you. Update the following values:

### 2.1 MongoDB Setup

**Option A: Local MongoDB** (Easiest for development)
```env
MONGODB_URI=mongodb://localhost:27017/ai-vision-studio
```
Make sure MongoDB is running locally on port 27017.

**Option B: MongoDB Atlas** (Cloud database - free tier available)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP (or use `0.0.0.0/0` for all IPs)
5. Get your connection string and update:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-vision-studio
```

### 2.2 Cloudinary Setup (Image Storage)

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard to find your credentials
3. Update in `.env`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2.3 Gmail SMTP Setup (Email Notifications)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account > Security > App passwords
   - Select "Mail" and "Other (Custom name)"
   - Copy the 16-character password
3. Update in `.env`:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-16-char-app-password
ADMIN_EMAIL=admin@aivisionstudio.com
```

**Note:** If you don't want to set up email immediately, you can skip this. The API will still work, but emails won't be sent.

---

## 🚀 Step 3: Start the Development Server

```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
✅ Email service is ready
🚀 Server is running!
📡 Port: 5000
🌍 Environment: development
🔗 API: http://localhost:5000/api
💚 Health: http://localhost:5000/health
```

---

## 🧪 Step 4: Test the API

### 4.1 Health Check

Open your browser or use curl:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "AI Vision Studio API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

### 4.2 Create Your First Admin User

Use a tool like **Postman**, **Thunder Client** (VS Code extension), or **curl**:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@aivisionstudio.com",
    "password": "SecurePass123",
    "name": "Admin"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "email": "admin@aivisionstudio.com",
      "name": "Admin",
      "role": "admin"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "..."
  }
}
```

**Save the `accessToken`** - you'll need it for protected endpoints!

### 4.3 Test Authentication

Login with your credentials:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@aivisionstudio.com",
    "password": "SecurePass123"
  }'
```

### 4.4 Test a Protected Endpoint

Get your user info using the access token:

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

---

## 📚 API Endpoints Overview

### Authentication
- `POST /api/auth/register` - Create admin user
- `POST /api/auth/login` - Login (get JWT token)
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh access token

### Blog Posts
- `GET /api/blog` - Get all posts (with pagination)
- `GET /api/blog/featured` - Get featured posts
- `GET /api/blog/slug/:slug` - Get post by slug
- `POST /api/blog` - Create post (protected)
- `PUT /api/blog/:id` - Update post (protected)
- `DELETE /api/blog/:id` - Delete post (protected)
- `PATCH /api/blog/:id/publish` - Publish draft (protected)

### Films
- `GET /api/films` - Get all films
- `GET /api/films/slug/:slug` - Get film by slug
- `POST /api/films` - Create film (protected)
- `PUT /api/films/:id` - Update film (protected)
- `DELETE /api/films/:id` - Delete film (protected)
- `PATCH /api/films/reorder` - Reorder films (protected)

### Video Projects
- `GET /api/videos` - Get all videos
- `GET /api/videos/slug/:slug` - Get video by slug
- `POST /api/videos` - Create video (protected)
- `PUT /api/videos/:id` - Update video (protected)
- `DELETE /api/videos/:id` - Delete video (protected)
- `PATCH /api/videos/reorder` - Reorder videos (protected)

### Contact Form
- `POST /api/contact` - Submit contact form (public)
- `GET /api/contact` - Get all submissions (protected)
- `GET /api/contact/stats` - Get submission stats (protected)
- `GET /api/contact/:id` - Get submission by ID (protected)
- `PATCH /api/contact/:id/status` - Update status (protected)
- `DELETE /api/contact/:id` - Delete submission (protected)

### Image Upload
- `POST /api/upload/blog` - Upload blog image (protected)
- `POST /api/upload/film` - Upload film poster (protected)
- `POST /api/upload/video` - Upload video thumbnail (protected)
- `POST /api/upload/image` - Upload general image (protected)
- `DELETE /api/upload/:publicId` - Delete image (protected)

---

## 🧪 Testing with Postman

### Import Collection

Create a new Postman collection with these examples:

**1. Register Admin**
```
POST http://localhost:5000/api/auth/register
Body (JSON):
{
  "email": "admin@test.com",
  "password": "Test1234",
  "name": "Test Admin"
}
```

**2. Create Blog Post**
```
POST http://localhost:5000/api/blog
Headers:
  Authorization: Bearer YOUR_TOKEN
Body (JSON):
{
  "title": "My First Blog Post",
  "excerpt": "This is a test blog post",
  "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
  "image": {
    "url": "https://images.unsplash.com/photo-1234",
    "alt": "Blog image"
  },
  "category": "Tutorial",
  "tags": ["AI", "Filmmaking"],
  "status": "published"
}
```

**3. Upload Image**
```
POST http://localhost:5000/api/upload/blog
Headers:
  Authorization: Bearer YOUR_TOKEN
Body (form-data):
  image: [Select file]
```

**4. Submit Contact Form**
```
POST http://localhost:5000/api/contact
Body (JSON):
{
  "name": "John Doe",
  "email": "john@example.com",
  "date": "2024-02-15",
  "time": "2:00 PM",
  "message": "I'd like to discuss a project with you."
}
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
❌ MongoDB connection error
```
**Solution:**
- Make sure MongoDB is running: `mongod` or check MongoDB Atlas connection string
- Check firewall settings
- Verify MONGODB_URI in `.env`

### Email Service Error
```
❌ Email service configuration error
```
**Solution:**
- Verify EMAIL_USER and EMAIL_APP_PASSWORD in `.env`
- Make sure you're using an App Password, not your regular Gmail password
- Check that 2FA is enabled on your Google account

### Cloudinary Upload Error
```
❌ Upload failed
```
**Solution:**
- Verify CLOUDINARY credentials in `.env`
- Check file size (max 10MB)
- Make sure you're uploading an image file

### Token Errors
```
Invalid or expired token
```
**Solution:**
- Make sure you're including the token in the Authorization header
- Format: `Bearer YOUR_TOKEN`
- If expired, login again to get a new token

---

## 📊 Database Inspection

### Using MongoDB Compass (GUI)
1. Download [MongoDB Compass](https://www.mongodb.com/try/download/compass)
2. Connect using your MONGODB_URI
3. Browse collections: users, blogposts, films, videoprojects, contactsubmissions

### Using MongoDB Shell
```bash
mongosh
use ai-vision-studio
db.users.find()
db.blogposts.find()
```

---

## 🔄 Next Steps

Now that your backend is running, you can:

1. **Migrate Existing Data**: Create a seed script to import your hardcoded blog posts and films
2. **Build Frontend Integration**: Update React components to fetch from the API
3. **Create Admin Panel**: Build a React admin dashboard to manage content
4. **Deploy**: Deploy backend to Railway/Render and database to MongoDB Atlas

---

## 📖 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Authentication Guide](https://jwt.io/introduction)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Nodemailer Documentation](https://nodemailer.com/)

---

## 🆘 Need Help?

If you encounter any issues:
1. Check the server logs for error messages
2. Verify all environment variables are set correctly
3. Make sure all services (MongoDB, Cloudinary, Gmail) are configured properly
4. Check the README.md for more detailed information

Happy coding! 🚀
