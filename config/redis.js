const redis = require('redis');

let redisClient = null;
let isRedisEnabled = process.env.REDIS_ENABLED === 'true';

const connectRedis = async () => {
    if (!isRedisEnabled) {
        console.log('⏭️  Redis is disabled via REDIS_ENABLED env variable');
        return null;
    }

    if (!process.env.REDIS_URL) {
        console.log('⚠️  REDIS_URL not configured - caching disabled');
        isRedisEnabled = false;
        return null;
    }

    try {
        const client = redis.createClient({
            url: process.env.REDIS_URL
        });

        client.on('error', (err) => {
            console.error('⚠️  Redis Client Error:', err);
            isRedisEnabled = false;
        });

        client.on('connect', () => {
            console.log('✅ Redis Client Connected');
        });

        await client.connect();
        redisClient = client;
        console.log('✅ Connected to Redis successfully');
        return client;
    } catch (error) {
        console.error('⚠️  Redis connection failed:', error.message);
        console.log('⚠️  Continuing without Redis caching...');
        isRedisEnabled = false;
        return null;
    }
};

const getRedisClient = () => {
    return redisClient;
};

const isRedisConnected = () => {
    return redisClient && redisClient.isOpen && isRedisEnabled;
};

module.exports = { connectRedis, getRedisClient, isRedisConnected };
