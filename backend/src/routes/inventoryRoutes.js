const { Router } = require('express');
const InventoryController = require('../controllers/inventoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = Router();

const INVENTORY_ROLES = ['ADMINISTRADOR', 'INVENTARIO'];

// Consulta de existencias y stock.
router.get('/', authMiddleware, roleMiddleware(INVENTORY_ROLES), InventoryController.getStock);
router.get('/low-stock', authMiddleware, roleMiddleware(INVENTORY_ROLES), InventoryController.getLowStock);

// Movimientos de inventario (entradas, salidas y ajustes).
// Se define /movements antes de cualquier ruta con parámetro.
router.post('/movements', authMiddleware, roleMiddleware(INVENTORY_ROLES), InventoryController.createMovement);
router.get('/movements', authMiddleware, roleMiddleware(INVENTORY_ROLES), InventoryController.getMovements);
router.get('/movements/:id', authMiddleware, roleMiddleware(INVENTORY_ROLES), InventoryController.getMovementById);

module.exports = router;