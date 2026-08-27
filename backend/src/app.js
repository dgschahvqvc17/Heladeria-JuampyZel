const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API REST
app.use('/api/auth', require('./routes/authRoutes'));

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error('[ERROR]', err.message);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Error interno del servidor'
    });
});

module.exports = app;
