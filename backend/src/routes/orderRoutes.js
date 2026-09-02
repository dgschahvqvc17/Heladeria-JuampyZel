const { Router } = require('express');
const OrderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = Router();

const MANAGEMENT_ROLES = ['ADMINISTRADOR', 'ENCARGADO_SUCURSAL', 'INVENTARIO'];

// Consulta de pedidos: administrador, encargado de sucursal e inventario
// ven todos; la tienda consulta únicamente sus propios pedidos.
router.get('/', authMiddleware, roleMiddleware([...MANAGEMENT_ROLES, 'TIENDA']), OrderController.getAll);

// Notificaciones de estado de pedidos: únicamente la tienda.
router.get('/notifications', authMiddleware, roleMiddleware(['TIENDA']), OrderController.getNotifications);

// Catálogo de productos disponibles para la tienda.
// Se define antes de /:id para no ser confundido con un id.
router.get('/catalog/products', authMiddleware, roleMiddleware(['TIENDA']), OrderController.getCatalog);

router.get('/:id', authMiddleware, roleMiddleware([...MANAGEMENT_ROLES, 'TIENDA']), OrderController.getById);

// Creación de pedidos: únicamente la tienda.
router.post('/', authMiddleware, roleMiddleware(['TIENDA']), OrderController.create);

// Actualización de estado: administrador, encargado de sucursal e inventario.
router.patch('/:id/status', authMiddleware, roleMiddleware(MANAGEMENT_ROLES), OrderController.updateStatus);

module.exports = router;
