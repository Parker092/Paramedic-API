const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const router = express.Router();
const redis = require('redis');
const client = redis.createClient();

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               dui:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado con éxito
 *       400:
 *         description: Error al registrar el usuario
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Iniciar sesión como usuario
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               dui:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', loginUser);


client.on('error', (err) => {
    console.error('Redis error:', err);
});

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Cerrar sesión del usuario
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Cierre de sesión exitoso
 */
router.post('/logout', (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
        client.set(token, true, 'EX', 24 * 60 * 60); // Establece una expiración para el token (24 horas)
    }
    res.status(200).json({ message: 'Cierre de sesión exitoso' });
});

module.exports = router;
