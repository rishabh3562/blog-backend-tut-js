# Phase 5: Production-Ready Features

Welcome to Phase 5 of the Blog Backend Tutorial! Learn how to make your application production-ready with caching, rate limiting, and advanced query features.

## What's New in Phase 5

- Redis caching with graceful degradation
- Cache-aside pattern implementation
- Multi-tier rate limiting (global, auth, post creation)
- Advanced query features (pagination, filtering, sorting, search)
- Cache invalidation on data mutations
- Production-ready error handling
- Performance optimization

## Project Structure

```
blog-backend-tut/
├── config/
│   ├── database.js
│   └── redis.js                 # New: Redis configuration
├── models/
│   ├── User.js
│   └── Post.js
├── controllers/
│   ├── userController.js
│   ├── authController.js
│   └── postController.js
├── routes/
│   ├── userRoutes.js
│   ├── authRoutes.js
│   └── postRoutes.js
├── middleware/
│   ├── errorHandler.js
│   ├── auth.js
│   ├── authorize.js
│   ├── validation.js
│   ├── cache.js                 # New: Caching middleware
│   └── rateLimiter.js           # New: Rate limiting
├── utils/
│   └── queryFeatures.js         # New: Query utilities
├── server.js
├── .env.example
└── package.json
```

## Setup

### Prerequisites
- Node.js v16+
- MongoDB (running)
- Redis (optional, but recommended for caching)

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your configuration
# Set REDIS_ENABLED=false if you don't have Redis installed
```

### Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/blog-tutorial
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
REDIS_URL=redis://localhost:6379
REDIS_ENABLED=true  # Set to false to disable caching
```

### Start Development Server

```bash
npm run dev
```

The application will work with or without Redis. If Redis is not available or disabled, the app will continue to function without caching.

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

## Phase 5 Features

### 1. Redis Caching

The application implements cache-aside pattern with automatic cache invalidation:

**Cached Routes:**
- `GET /api/posts` - Cached for 5 minutes (300 seconds)
- `GET /api/posts/:id` - Cached for 10 minutes (600 seconds)

**Cache Invalidation:**
Cache is automatically cleared when:
- New post is created
- Post is updated
- Post is deleted

**Cache Indicators:**
Responses include `fromCache: true` when served from cache.

**Graceful Degradation:**
If Redis is not available or disabled, the application works normally without caching.

### 2. Rate Limiting

Three-tier rate limiting for security and performance:

**Global API Limiter:**
- Applies to all `/api/*` routes
- 100 requests per 15 minutes per IP
- Headers: `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`

**Auth Limiter:**
- Applies to `/api/auth/register` and `/api/auth/login`
- 5 requests per 15 minutes per IP
- Skips counting successful requests

**Post Creation Limiter:**
- Applies to `POST /api/posts`
- 10 posts per hour per IP
- Prevents spam and abuse

### 3. Advanced Query Features

#### Pagination

```bash
GET /api/posts?page=1&limit=10
```

Response includes pagination metadata:
```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### Filtering

```bash
# Filter by status
GET /api/posts?status=published

# Filter by author
GET /api/posts?author=USER_ID

# Filter by category
GET /api/posts?category=technology

# Advanced filtering (gte, gt, lte, lt)
GET /api/posts?views[gte]=100
```

#### Sorting

```bash
# Sort by creation date (newest first) - default
GET /api/posts?sort=-createdAt

# Sort by views (ascending)
GET /api/posts?sort=views

# Sort by multiple fields
GET /api/posts?sort=-views,createdAt
```

#### Text Search

```bash
# Search in title and content
GET /api/posts?search=nodejs

# Uses MongoDB text indexes for performance
```

#### Field Limiting

```bash
# Select specific fields
GET /api/posts?fields=title,content,author

# Excludes __v by default
```

#### Combined Queries

```bash
# Combine all features
GET /api/posts?status=published&search=nodejs&sort=-views&page=1&limit=5&fields=title,author,views
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

## Testing Phase 5 Features

### Test Caching

```bash
# First request - Cache MISS
curl http://localhost:5000/api/posts

# Second request (within 5 minutes) - Cache HIT
curl http://localhost:5000/api/posts

# Check response for "fromCache": true
```

### Test Rate Limiting

```bash
# Send multiple requests rapidly
for i in {1..101}; do
  curl http://localhost:5000/api/posts
done

# After 100 requests, you'll see rate limit error
```

### Test Pagination

```bash
# Get first page
curl "http://localhost:5000/api/posts?page=1&limit=5"

# Get second page
curl "http://localhost:5000/api/posts?page=2&limit=5"
```

### Test Advanced Filtering

```bash
# Filter published posts with high views
curl "http://localhost:5000/api/posts?status=published&views[gte]=50"

# Sort by views descending
curl "http://localhost:5000/api/posts?sort=-views"

# Search posts
curl "http://localhost:5000/api/posts?search=nodejs"
```

## Production Considerations

### Redis Setup
- Use Redis Cluster or Redis Sentinel for high availability
- Configure Redis persistence (RDB/AOF)
- Set appropriate memory limits and eviction policies
- Monitor Redis memory usage

### Rate Limiting
- Adjust limits based on your traffic patterns
- Consider using Redis store for distributed rate limiting
- Implement IP whitelisting for trusted sources
- Add authenticated user-based rate limits

### Caching Strategy
- Review cache durations based on data update frequency
- Implement cache warming for frequently accessed data
- Monitor cache hit/miss ratios
- Consider adding cache versioning for breaking changes

### Performance Monitoring
- Track response times
- Monitor cache effectiveness
- Analyze rate limit hits
- Set up alerts for anomalies

## Key Learnings - Phase 5

1. **Caching Strategies:**
   - Cache-aside pattern implementation
   - Automatic cache invalidation
   - Graceful degradation without Redis

2. **Rate Limiting:**
   - Multi-tier protection
   - IP-based limiting
   - Route-specific limits

3. **Query Optimization:**
   - Pagination for large datasets
   - MongoDB indexes for search
   - Flexible filtering and sorting

4. **Production Readiness:**
   - Error handling
   - Graceful service degradation
   - Performance optimization
   - Security best practices

## What You've Built

Congratulations! You've built a production-ready blog API with:

- JWT authentication and authorization
- Role-based access control (RBAC)
- Blog post CRUD operations with validation
- Redis caching with automatic invalidation
- Multi-tier rate limiting
- Advanced query features (pagination, filtering, sorting, search)
- Graceful error handling
- Production-ready architecture

## Next Steps

- Deploy to production (Heroku, AWS, DigitalOcean)
- Add file upload for blog images
- Implement comments system
- Add social features (likes, shares)
- Create admin dashboard
- Add email notifications
- Implement WebSockets for real-time features
- Add comprehensive testing (unit, integration, e2e)
- Set up CI/CD pipeline
- Add API documentation (Swagger/OpenAPI)
