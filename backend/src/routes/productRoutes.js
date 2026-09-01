const { Router } = require('express');
const ProductController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = Router();

const ALL_ROLES = ['ADMINISTRADOR', 'ENCARGADO_SUCURSAL', 'VENDEDOR', 'INVENTARIO'];
const ADMIN_ROLES = ['ADMINISTRADOR'];

// Consulta de productos: disponible para los roles autenticados de la empresa.
router.get('/', authMiddleware, roleMiddleware(ALL_ROLES), ProductController.getAll);
router.get('/active', authMiddleware, roleMiddleware(ALL_ROLES), ProductController.getActiveAll);
router.get('/:id', authMiddleware, roleMiddleware(ALL_ROLES), ProductController.getById);

// Gestión de productos (registro, edición, estado): solo administrador.
router.post('/', authMiddleware, roleMiddleware(ADMIN_ROLES), upload.single('imagen'), ProductController.create);
router.put('/:id', authMiddleware, roleMiddleware(ADMIN_ROLES), upload.single('imagen'), ProductController.update);
router.patch('/:id/status', authMiddleware, roleMiddleware(ADMIN_ROLES), ProductController.toggleStatus);

module.exports = router;
