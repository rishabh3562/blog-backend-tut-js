const { getRedisClient, isRedisConnected } = require('../config/redis');

// Cache middleware
exports.cache = (duration = 300) => {
    return async (req, res, next) => {
        // Skip caching if Redis is not available
        if (!isRedisConnected()) {
            return next();
        }

        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }

        const key = `cache:${req.originalUrl}`;
        const redisClient = getRedisClient();

        try {
            // Check if data exists in cache
            const cachedData = await redisClient.get(key);

            if (cachedData) {
                console.log(`✅ Cache HIT: ${req.originalUrl}`);
                return res.status(200).json({
                    ...JSON.parse(cachedData),
                    fromCache: true
                });
            }

            console.log(`❌ Cache MISS: ${req.originalUrl}`);

            // Store original res.json function
            const originalJson = res.json.bind(res);

            // Override res.json to cache the response
            res.json = function(data) {
                // Cache the response
                redisClient.setEx(key, duration, JSON.stringify(data))
                    .catch(err => console.error('⚠️  Cache set error:', err));

                // Call original json function
                return originalJson(data);
            };

            next();
        } catch (error) {
            console.error('⚠️  Cache error:', error);
            next();
        }
    };
};

// Clear cache by pattern
exports.clearCache = async (pattern = 'cache:*') => {
    if (!isRedisConnected()) {
        return;
    }

    const redisClient = getRedisClient();

    try {
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
            await redisClient.del(keys);
            console.log(`✅ Cleared ${keys.length} cache entries`);
        }
    } catch (error) {
        console.error('⚠️  Clear cache error:', error);
    }
};
