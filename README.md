# Phase 2: MVC Architecture

Welcome to Phase 2 of the Blog Backend Tutorial! Learn how to structure your application using the Model-View-Controller (MVC) pattern.

## What's New in Phase 2

- Separated database connection logic into `config/database.js`
- Organized code into Models, Controllers, and Routes
- Added centralized error handling middleware
- Enhanced User model with better validation
- Clean and maintainable code structure

## Project Structure

```
blog-backend-tut/
├── config/
│   └── database.js          # Database connection logic
├── models/
│   └── User.js              # User model with enhanced validation
├── controllers/
│   └── userController.js    # User business logic
├── routes/
│   └── userRoutes.js        # User route definitions
├── middleware/
│   └── errorHandler.js      # Centralized error handling
├── server.js                # Application entry point
├── .env                     # Environment variables
└── package.json
```

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## API Endpoints

All routes are now prefixed with `/api`

- POST `/api/users` - Create user
- GET `/api/users` - Get all users
- GET `/api/users/:id` - Get user by ID
- PUT `/api/users/:id` - Full update
- PATCH `/api/users/:id` - Partial update
- DELETE `/api/users/:id` - Delete user

## Key Improvements

### Enhanced Validation
- Name: 2-50 characters
- Email: Valid email format with regex
- Age: 0-150 range validation

### Error Handling
- Centralized error middleware
- Proper error messages for validation, duplicate keys, and invalid IDs
- Consistent error response format

### Code Organization
- Separation of concerns (MVC pattern)
- Reusable and maintainable code
- Easy to test and extend

## What's Next?

Phase 3: Authentication & Authorization
