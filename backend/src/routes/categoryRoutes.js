const { Router } = require('express');
const CategoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = Router();

const ALL_ROLES = ['ADMINISTRADOR', 'ENCARGADO_SUCURSAL', 'VENDEDOR', 'INVENTARIO'];
const ADMIN_ROLES = ['ADMINISTRADOR'];

// Consulta de categorías: disponible para los roles autenticados de la empresa.
router.get('/', authMiddleware, roleMiddleware(ALL_ROLES), CategoryController.getAll);
router.get('/active', authMiddleware, roleMiddleware(ALL_ROLES), CategoryController.getActiveAll);
router.get('/:id', authMiddleware, roleMiddleware(ALL_ROLES), CategoryController.getById);

// Gestión de categorías (registro, edición, estado): solo administrador.
router.post('/', authMiddleware, roleMiddleware(ADMIN_ROLES), CategoryController.create);
router.put('/:id', authMiddleware, roleMiddleware(ADMIN_ROLES), CategoryController.update);
router.patch('/:id/status', authMiddleware, roleMiddleware(ADMIN_ROLES), CategoryController.toggleStatus);

module.exports = router;
