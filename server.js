// server.js
const mongoose = require('mongoose');
const app = require('./src/app');

require('dotenv').config();

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
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
