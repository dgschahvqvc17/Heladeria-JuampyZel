const { Router } = require('express');
const PublicController = require('../controllers/publicController');

const router = Router();

// Estadísticas públicas para la página de inicio de sesión.
router.get('/stats', PublicController.getStats);

module.exports = router;
