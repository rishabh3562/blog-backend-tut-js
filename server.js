require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const { connectRedis } = require('./config/redis');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

// Body parser middleware
app.use(express.json());

// Apply global rate limiter to all API routes
app.use('/api', apiLimiter);

// Mount routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Initialize database and Redis connections
const initializeApp = async () => {
    try {
        await Promise.all([
            connectDB(),
            connectRedis()
        ]);

        app.listen(PORT, () => {
            console.log(`✅ Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to initialize application:', error);
        process.exit(1);
    }
};

initializeApp();
