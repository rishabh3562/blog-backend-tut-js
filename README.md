# Phase 4: Blog Features

Welcome to Phase 4 of the Blog Backend Tutorial! Learn how to implement core blog functionality with posts, validation, and authorization.

## What's New in Phase 4

- Blog post CRUD operations
- Request validation with express-validator
- Role-based authorization
- Post ownership verification
- Advanced filtering and search
- View counter for posts
- Author population

## Project Structure

```
blog-backend-tut/
├── config/
│   └── database.js
├── models/
│   ├── User.js
│   └── Post.js                  # New: Blog post model
├── controllers/
│   ├── userController.js
│   ├── authController.js
│   └── postController.js        # New: Post operations
├── routes/
│   ├── userRoutes.js
│   ├── authRoutes.js
│   └── postRoutes.js            # New: Post routes
├── middleware/
│   ├── errorHandler.js
│   ├── auth.js
│   ├── authorize.js             # New: Role-based access
│   └── validation.js            # New: Input validation
├── server.js
├── .env.example
└── package.json
```

## Setup

```bash
npm install
cp .env.example .env
# Update .env with your configuration
npm run dev
```

## API Endpoints

### Authentication Routes
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user (Protected)

### User Routes (Protected)
- POST `/api/users` - Create user
- GET `/api/users` - Get all users
- GET `/api/users/:id` - Get user by ID
- PUT `/api/users/:id` - Full update
- PATCH `/api/users/:id` - Partial update
- DELETE `/api/users/:id` - Delete user

### Post Routes
#### Public
- GET `/api/posts` - Get all posts (with filtering)
- GET `/api/posts/:id` - Get single post

#### Protected
- POST `/api/posts` - Create new post
- PUT `/api/posts/:id` - Update post (owner/admin only)
- DELETE `/api/posts/:id` - Delete post (owner/admin only)
- GET `/api/posts/my/posts` - Get logged in user's posts

## Post Features

### Filtering & Search

Get posts with query parameters:

```bash
# Filter by status
GET /api/posts?status=published

# Filter by author
GET /api/posts?author=USER_ID

# Filter by category
GET /api/posts?category=technology

# Search in title and content
GET /api/posts?search=nodejs

# Combine filters
GET /api/posts?status=published&category=technology
```

### Post Model Fields

- `title` - Post title (5-100 characters)
- `content` - Post content (min 10 characters)
- `author` - Reference to User (auto-set)
- `status` - draft or published (default: draft)
- `tags` - Array of tags
- `category` - Post category
- `views` - View counter (auto-incremented)
- `publishedAt` - Auto-set when status changes to published
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

### Validation

All post creation and updates are validated:
- Title: 5-100 characters required
- Content: Minimum 10 characters required
- Status: Must be 'draft' or 'published'
- Category: Maximum 50 characters
- Tags: Must be an array

### Authorization

- Post creation: Requires authentication
- Post updates: Only owner or admin can update
- Post deletion: Only owner or admin can delete
- View posts: Public access

## Example Usage

### Create Post
```bash
POST /api/posts
Headers:
  Authorization: Bearer <token>
Body:
{
  "title": "Introduction to Node.js",
  "content": "Node.js is a powerful JavaScript runtime...",
  "status": "published",
  "category": "technology",
  "tags": ["nodejs", "javascript", "backend"]
}
```

### Update Post
```bash
PUT /api/posts/:id
Headers:
  Authorization: Bearer <token>
Body:
{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

### Get My Posts
```bash
GET /api/posts/my/posts
Headers:
  Authorization: Bearer <token>
```

## Key Features

### Ownership Verification
- Users can only update/delete their own posts
- Admins can update/delete any post

### View Counter
- Automatically increments when a post is viewed
- Useful for analytics and trending posts

### Text Search
- Full-text search in title and content
- Uses MongoDB text indexes for performance

### Author Population
- Post responses include author details
- Shows author name and email

### Validation Middleware
- Clean error messages for invalid input
- Field-level validation feedback

## What's Next?

Phase 5: Advanced Features (Caching, Rate Limiting, Query Features)
