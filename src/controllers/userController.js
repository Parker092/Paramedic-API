const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, dui } = req.body; // Agregar DUI a los campos recibidos
        const user = new User({ name, email, password, dui });
        await user.save();
        res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password, dui } = req.body; // Agregar DUI a los campos recibidos
        const user = await User.findOne({ email, dui }); // Buscar por email y DUI
        if (!user || !(await bcryptjs.compare(password, user.password))) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        const token = jwt.sign({ id: user._id, dui: user.dui }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
