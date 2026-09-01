const { Router } = require('express');
const StoreController = require('../controllers/storeController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = Router();

// Según la HU06, el administrador es quien gestiona las tiendas. 
// Daremos permisos al Encargado de Inventario para que pueda consultarlas y gestionar envíos futuros.
router.get('/', authMiddleware, roleMiddleware(['ADMINISTRADOR', 'INVENTARIO']), StoreController.getAll);
router.get('/:id', authMiddleware, roleMiddleware(['ADMINISTRADOR', 'INVENTARIO']), StoreController.getById);
router.post('/', authMiddleware, roleMiddleware(['ADMINISTRADOR']), StoreController.create);
router.put('/:id', authMiddleware, roleMiddleware(['ADMINISTRADOR']), StoreController.update);
router.patch('/:id/status', authMiddleware, roleMiddleware(['ADMINISTRADOR']), StoreController.toggleStatus);

module.exports = router;