const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id, dui: decoded.dui }; // Agregar DUI al usuario autenticado
        next();
    } catch (err) {
        console.error('Token inválido:', err);
        res.status(401).json({ message: 'Token no válido' });
    }
};

module.exports = authMiddleware;
