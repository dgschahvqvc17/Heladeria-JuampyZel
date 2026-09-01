const { Router } = require('express');
const SaleController = require('../controllers/saleController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = Router();

const SALE_ROLES = ['ADMINISTRADOR', 'ENCARGADO_SUCURSAL', 'VENDEDOR'];

// Consulta de ventas: administrador, encargado de sucursal y vendedor.
router.get('/', authMiddleware, roleMiddleware(SALE_ROLES), SaleController.getAll);

// Productos con stock disponibles para una sucursal (punto de venta).
// Se define antes de /:id para no ser confundido con un id.
router.get('/products', authMiddleware, roleMiddleware(SALE_ROLES), SaleController.getProductsByBranch);

router.get('/:id', authMiddleware, roleMiddleware(SALE_ROLES), SaleController.getById);

// Registro de ventas.
router.post('/', authMiddleware, roleMiddleware(SALE_ROLES), SaleController.create);

module.exports = router;
