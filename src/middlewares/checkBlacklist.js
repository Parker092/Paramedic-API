const { createClient } = require('redis');

let redisClient;

(async () => {
    try {
        redisClient = createClient({
            url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
        });

        redisClient.on('error', (err) => {
            console.error('Redis Client Error', err);
        });

        await redisClient.connect();
        console.log('✅ Conectado a Redis');
    } catch (error) {
        console.error('Error al conectar a Redis:', error);
    }
})();

const checkBlacklist = async (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const isBlacklisted = await redisClient.get(token);
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Token is blacklisted' });
        }

        next();
    } catch (error) {
        console.error('Error checking blacklist', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = checkBlacklist;
