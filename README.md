# Phase 3: Authentication & Authorization

Welcome to Phase 3 of the Blog Backend Tutorial! Learn how to implement user authentication and authorization with JWT (JSON Web Tokens).

## What's New in Phase 3

- User registration and login functionality
- Password hashing with bcryptjs
- JWT-based authentication
- Protected routes with middleware
- User roles (user/admin)
- Token-based session management

## Project Structure

```
blog-backend-tut/
├── config/
│   └── database.js
├── models/
│   └── User.js              # Updated with password & role
├── controllers/
│   ├── userController.js
│   └── authController.js    # New: Auth logic
├── routes/
│   ├── userRoutes.js        # Updated: Protected routes
│   └── authRoutes.js        # New: Auth routes
├── middleware/
│   ├── errorHandler.js
│   └── auth.js              # New: JWT middleware
├── server.js
├── .env.example             # Updated with JWT vars
└── package.json
```

## Setup

```bash
npm install
cp .env.example .env
# Update .env with your JWT_SECRET
npm run dev
```

## Environment Variables

Add these to your `.env` file:

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/blog-tutorial
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
```

## API Endpoints

### Authentication Routes (Public)
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user (Protected)

### User Routes (All Protected)
- POST `/api/users` - Create user
- GET `/api/users` - Get all users
- GET `/api/users/:id` - Get user by ID
- PUT `/api/users/:id` - Full update
- PATCH `/api/users/:id` - Partial update
- DELETE `/api/users/:id` - Delete user

## How Authentication Works

1. **Registration**: User creates account with email/password
2. **Password Hashing**: Password is hashed using bcryptjs before saving
3. **Login**: User provides credentials, receives JWT token
4. **Protected Routes**: Token required in Authorization header
5. **Token Format**: `Bearer <token>`

## Example Usage

### Register
```bash
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "age": 25
}
```

### Login
```bash
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Access Protected Route
```bash
GET /api/users
Headers:
  Authorization: Bearer <your_jwt_token>
```

## Key Features

### Password Security
- Passwords hashed with bcryptjs (10 rounds)
- Passwords never returned in API responses
- Secure password comparison

### JWT Tokens
- Stateless authentication
- Token expiration (30 days default)
- User ID embedded in token payload

### Protected Routes
- Middleware validates JWT tokens
- User object attached to request
- Unauthorized access returns 401

### User Roles
- Role-based access control ready
- Default role: 'user'
- Admin role available for future features

## What's Next?

Phase 4: Blog Features (Posts, Comments, Categories)
