# AI Vision Studio - API Documentation

Complete REST API documentation for the backend.

**Base URL:** `http://localhost:5000/api`

---

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Endpoints

#### Register Admin User
```http
POST /api/auth/register
```

**Body:**
```json
{
  "email": "admin@example.com",
  "password": "SecurePass123",
  "name": "Admin Name"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "admin@example.com",
      "name": "Admin Name",
      "role": "admin"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "admin@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { /* user object */ },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

#### Get Current User (Protected)
```http
GET /api/auth/me
Headers: Authorization: Bearer TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "admin@example.com",
      "name": "Admin Name",
      "role": "admin",
      "lastLogin": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### Logout
```http
POST /api/auth/logout
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
```

**Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "new_access_token..."
  }
}
```

---

## 📝 Blog Posts

### Get All Posts (Public)
```http
GET /api/blog?page=1&limit=10&status=published&category=Tutorial&search=AI
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `status` (string): Filter by status (draft/published/archived)
- `category` (string): Filter by category
- `featured` (boolean): Filter featured posts
- `search` (string): Search in title/excerpt

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "The Future of AI in Filmmaking",
      "slug": "the-future-of-ai-in-filmmaking",
      "excerpt": "Exploring how AI is transforming the film industry...",
      "content": "Full blog post content...",
      "image": {
        "url": "https://res.cloudinary.com/...",
        "publicId": "ai-vision-studio/blog/abc123",
        "alt": "AI Filmmaking"
      },
      "category": "AI & Film",
      "tags": ["AI", "Filmmaking", "VFX"],
      "readTime": "8 min read",
      "publishedAt": "2024-01-15T00:00:00.000Z",
      "status": "published",
      "featured": true,
      "views": 142,
      "author": {
        "name": "AI Vision Studio",
        "avatar": ""
      },
      "seo": {
        "metaTitle": "The Future of AI in Filmmaking | AI Vision Studio",
        "metaDescription": "...",
        "keywords": ["AI", "Filmmaking"]
      },
      "createdAt": "2024-01-10T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### Get Featured Posts (Public)
```http
GET /api/blog/featured
```

### Get Post by Slug (Public)
```http
GET /api/blog/slug/the-future-of-ai-in-filmmaking
```

### Get Categories (Public)
```http
GET /api/blog/categories
```

**Response:**
```json
{
  "success": true,
  "data": ["AI & Film", "Workflow", "Tutorial", "Industry"]
}
```

### Get Tags (Public)
```http
GET /api/blog/tags
```

### Create Post (Protected)
```http
POST /api/blog
Headers: Authorization: Bearer TOKEN
```

**Body:**
```json
{
  "title": "New Blog Post Title",
  "excerpt": "Short description of the post",
  "content": "Full content in markdown or HTML...",
  "image": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "ai-vision-studio/blog/xyz789",
    "alt": "Blog post image"
  },
  "category": "Tutorial",
  "tags": ["AI", "VFX"],
  "readTime": "5 min read",
  "featured": false,
  "status": "draft",
  "seo": {
    "metaTitle": "Custom meta title",
    "metaDescription": "Custom meta description",
    "keywords": ["keyword1", "keyword2"]
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Blog post created successfully",
  "data": { /* created post */ }
}
```

### Update Post (Protected)
```http
PUT /api/blog/:id
Headers: Authorization: Bearer TOKEN
```

**Body:** (same as create, all fields optional)

### Delete Post (Protected)
```http
DELETE /api/blog/:id
Headers: Authorization: Bearer TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "message": "Blog post deleted successfully"
}
```

### Publish Post (Protected)
```http
PATCH /api/blog/:id/publish
Headers: Authorization: Bearer TOKEN
```

---

## 🎬 Films

### Get All Films (Public)
```http
GET /api/films?status=active&featured=true
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "The Woman King",
      "slug": "the-woman-king",
      "role": "Digital Compositor",
      "year": "2022",
      "category": "Action Drama",
      "image": {
        "url": "https://res.cloudinary.com/...",
        "publicId": "ai-vision-studio/posters/the-woman-king",
        "alt": "The Woman King poster"
      },
      "rating": "7.8",
      "description": "Epic historical drama...",
      "imdbLink": "https://www.imdb.com/title/tt8093700/",
      "showreelUrl": "https://vimeo.com/...",
      "order": 0,
      "featured": true,
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Film by Slug (Public)
```http
GET /api/films/slug/the-woman-king
```

### Create Film (Protected)
```http
POST /api/films
Headers: Authorization: Bearer TOKEN
```

**Body:**
```json
{
  "title": "Film Title",
  "role": "VFX Supervisor",
  "year": "2024",
  "category": "Sci-Fi",
  "image": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "...",
    "alt": "Film poster"
  },
  "rating": "8.5",
  "description": "Film description",
  "imdbLink": "https://www.imdb.com/title/...",
  "showreelUrl": "https://vimeo.com/...",
  "featured": true
}
```

### Update Film (Protected)
```http
PUT /api/films/:id
Headers: Authorization: Bearer TOKEN
```

### Delete Film (Protected)
```http
DELETE /api/films/:id
Headers: Authorization: Bearer TOKEN
```

### Reorder Films (Protected)
```http
PATCH /api/films/reorder
Headers: Authorization: Bearer TOKEN
```

**Body:**
```json
{
  "filmIds": [
    "507f1f77bcf86cd799439011",
    "507f1f77bcf86cd799439012",
    "507f1f77bcf86cd799439013"
  ]
}
```

---

## 🎥 Video Projects

### Get All Videos (Public)
```http
GET /api/videos?status=active&featured=true
```

**Response:** (similar structure to films)

### Get Video by Slug (Public)
```http
GET /api/videos/slug/commercial-project
```

### Create Video (Protected)
```http
POST /api/videos
Headers: Authorization: Bearer TOKEN
```

**Body:**
```json
{
  "title": "Commercial Project",
  "category": "Advertising",
  "year": "2023",
  "role": "VFX Artist",
  "thumbnail": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "...",
    "alt": "Video thumbnail"
  },
  "videoUrl": "https://www.youtube.com/watch?v=...",
  "description": "Project description",
  "featured": false
}
```

### Update Video (Protected)
```http
PUT /api/videos/:id
Headers: Authorization: Bearer TOKEN
```

### Delete Video (Protected)
```http
DELETE /api/videos/:id
Headers: Authorization: Bearer TOKEN
```

### Reorder Videos (Protected)
```http
PATCH /api/videos/reorder
Headers: Authorization: Bearer TOKEN
```

---

## 📧 Contact Form

### Submit Contact Form (Public)
```http
POST /api/contact
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "date": "2024-02-15",
  "time": "2:00 PM",
  "message": "I would like to discuss a potential project with you."
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Meeting request submitted successfully. Check your email for confirmation!",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "date": "2024-02-15T00:00:00.000Z",
    "time": "2:00 PM"
  }
}
```

**Note:** This endpoint sends two emails:
1. Notification to admin (ADMIN_EMAIL)
2. Confirmation to user

### Get All Submissions (Protected)
```http
GET /api/contact?status=pending&page=1&limit=20
Headers: Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "date": "2024-02-15T00:00:00.000Z",
      "time": "2:00 PM",
      "message": "Project discussion request...",
      "status": "pending",
      "notes": "",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": { /* pagination info */ }
}
```

### Get Submission Stats (Protected)
```http
GET /api/contact/stats
Headers: Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 45,
    "byStatus": {
      "pending": 12,
      "contacted": 20,
      "completed": 13
    }
  }
}
```

### Get Submission by ID (Protected)
```http
GET /api/contact/:id
Headers: Authorization: Bearer TOKEN
```

### Update Submission Status (Protected)
```http
PATCH /api/contact/:id/status
Headers: Authorization: Bearer TOKEN
```

**Body:**
```json
{
  "status": "contacted",
  "notes": "Sent calendar invite for next Tuesday"
}
```

### Delete Submission (Protected)
```http
DELETE /api/contact/:id
Headers: Authorization: Bearer TOKEN
```

---

## 🖼️ Image Upload

All upload endpoints require authentication and use `multipart/form-data`.

### Upload Blog Image (Protected)
```http
POST /api/upload/blog
Headers:
  Authorization: Bearer TOKEN
  Content-Type: multipart/form-data
Body:
  image: [file]
```

**Response (200):**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/ai-vision-studio/blog/abc123.jpg",
    "publicId": "ai-vision-studio/blog/abc123",
    "width": 1920,
    "height": 1080,
    "format": "jpg"
  }
}
```

### Upload Film Poster (Protected)
```http
POST /api/upload/film
Headers: Authorization: Bearer TOKEN
Body (multipart/form-data): image
```

### Upload Video Thumbnail (Protected)
```http
POST /api/upload/video
Headers: Authorization: Bearer TOKEN
Body (multipart/form-data): image
```

### Upload General Image (Protected)
```http
POST /api/upload/image
Headers: Authorization: Bearer TOKEN
Body (multipart/form-data):
  image: [file]
  folder: "custom-folder" (optional)
```

### Delete Image (Protected)
```http
DELETE /api/upload/:publicId
Headers: Authorization: Bearer TOKEN
```

**Example:**
```http
DELETE /api/upload/ai-vision-studio%2Fblog%2Fabc123
```

**Note:** URL encode the publicId (replace `/` with `%2F`)

---

## ❌ Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (e.g., duplicate email)
- `500` - Internal Server Error

### Validation Errors

```json
{
  "success": false,
  "error": "Validation Error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

---

## 🔒 Rate Limiting

The API implements rate limiting:
- **Window:** 15 minutes
- **Max Requests:** 100 per IP

If you exceed the limit:
```json
{
  "success": false,
  "error": "Too many requests from this IP, please try again later."
}
```

---

## 📌 Notes

- All dates are in ISO 8601 format: `2024-01-15T10:30:00.000Z`
- All responses include a `success` boolean field
- Protected endpoints require `Authorization: Bearer TOKEN` header
- File uploads limited to 10MB
- Only image files accepted for uploads
- JWT tokens expire after 1 hour (access) / 7 days (refresh)

---

## 🧪 Postman Collection

Import this URL into Postman to get started:
```
[Will be generated after deployment]
```

Or manually create requests using the examples above.
