// server.js
const mongoose = require('mongoose');
const app = require('./src/app');
const { createClient } = require('redis');

require('dotenv').config();

let redisClient;

// Inicializar y conectar Redis
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

// Conectar a la base de datos
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('🗄️  Conectado a la base de datos');
}).catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
});

// Iniciar servidor en el puerto 5001
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

// Manejo de cierre del servidor
process.on('SIGINT', async () => {
    console.log('🛑 Apagando el servidor...');
    server.close(async () => {
        console.log('🚪 Servidor Express cerrado.');
        
        if (redisClient && redisClient.isOpen) {
            console.log('🔄 Cerrando conexión a Redis...');
            try {
                await redisClient.disconnect();
                console.log('🛑 Conexión a Redis cerrada.');
            } catch (err) {
                console.error('❌ Error al cerrar la conexión a Redis:', err);
            }
        } else {
            console.warn('⚠️ Redis ya estaba cerrado o no estaba disponible.');
        }

        mongoose.connection.close(() => {
            console.log('🛑 Conexión a la base de datos cerrada.');
            process.exit(0);
        });
    });
});
