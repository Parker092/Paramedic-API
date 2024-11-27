// app.js
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const medicationRoutes = require('./routes/medicationRoutes');
const setupSwaggerDocs = require('./swagger/swagger');
const authMiddleware = require('./middlewares/authMiddleware');
const checkBlacklist = require('./middlewares/checkBlacklist');

const app = express();

// Configuración de CORS
app.use(cors({
    origin: '*', // Permitir todas las solicitudes desde cualquier origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
}));

// Middleware para parsear JSON
app.use(express.json());

// Rutas protegidas con verificación de lista negra y autenticación
app.use('/api/medication', checkBlacklist, authMiddleware, medicationRoutes);

// Rutas de usuario
app.use('/api/user', userRoutes);

// Configuración de Swagger
setupSwaggerDocs(app);

module.exports = app;
