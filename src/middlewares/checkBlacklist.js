// checkBlacklist.js
const { createClient } = require('redis');

let redisClient;

(async () => {
    try {
        redisClient = createClient({
            url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
        });

        redisClient.on('error', (err) => {
            console.error('❌ Redis Client Error:', err);
        });

        redisClient.on('connect', () => {
            console.log('✅ Conectado a Redis');
        });

        await redisClient.connect();
    } catch (error) {
        console.error('Error al conectar a Redis:', error);
    }
})();

const checkRedisConnection = async () => {
    if (!redisClient.isOpen) {
        console.warn('⚠️ Cliente Redis no está conectado. Intentando reconectar...');
        try {
            await redisClient.connect();
            console.log('🔄 Reconexión a Redis exitosa');
        } catch (reconnectError) {
            console.error('❌ Error al reconectar a Redis:', reconnectError);
            throw reconnectError; // Lanzar el error para que pueda ser manejado por la función que llama.
        }
    }
};

const checkBlacklist = async (req, res, next) => {
    try {
        // Verificar si hay un token en el header de autorización
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            console.warn('⚠️ No se proporcionó token');
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verificar la conexión de Redis antes de continuar
        await checkRedisConnection();

        // Verificar si el token está en la lista negra
        console.log(`🔍 Verificando token ${token} en la lista negra...`);
        const isBlacklisted = await redisClient.get(token);
        if (isBlacklisted) {
            console.warn(`🚫 Token ${token} está en la lista negra`);
            return res.status(401).json({ message: 'Token is blacklisted' });
        }

        // Confirmar que el token no está en la lista negra
        console.log(`✅ Token ${token} no está en la lista negra`);
        next();
    } catch (error) {
        console.error('❌ Error al verificar la lista negra:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = checkBlacklist;
