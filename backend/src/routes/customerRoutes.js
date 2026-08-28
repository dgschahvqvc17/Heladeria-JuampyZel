const { Router } = require('express');
const CustomerController = require('../controllers/customerController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = Router();

// Según la HU05, el vendedor registra y consulta clientes;
// la consulta está disponible para los roles autenticados de la empresa.
router.get('/', authMiddleware, roleMiddleware(['ADMINISTRADOR', 'ENCARGADO_SUCURSAL', 'VENDEDOR', 'INVENTARIO']), CustomerController.getAll);
router.get('/:id', authMiddleware, roleMiddleware(['ADMINISTRADOR', 'ENCARGADO_SUCURSAL', 'VENDEDOR', 'INVENTARIO']), CustomerController.getById);
router.post('/', authMiddleware, roleMiddleware(['ADMINISTRADOR', 'VENDEDOR']), CustomerController.create);
router.put('/:id', authMiddleware, roleMiddleware(['ADMINISTRADOR', 'VENDEDOR']), CustomerController.update);

module.exports = router;
