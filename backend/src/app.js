const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos (imágenes subidas)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas de la API REST
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/branches', require('./routes/branchRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/stores', require('./routes/storeRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/sales', require('./routes/saleRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error('[ERROR]', err.message);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Error interno del servidor'
    });
});

module.exports = app;
