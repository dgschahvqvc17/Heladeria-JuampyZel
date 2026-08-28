const { Router } = require('express');
const BranchController = require('../controllers/branchController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = Router();

// Según la HU04, el administrador es quien gestiona las sucursales.
router.get('/', authMiddleware, roleMiddleware(['ADMINISTRADOR', 'ENCARGADO_SUCURSAL', 'VENDEDOR']), BranchController.getAll);
router.get('/managers/disponibles', authMiddleware, roleMiddleware(['ADMINISTRADOR', 'ENCARGADO_SUCURSAL']), BranchController.getAvailableManagers);
router.get('/:id', authMiddleware, roleMiddleware(['ADMINISTRADOR']), BranchController.getById);
router.post('/', authMiddleware, roleMiddleware(['ADMINISTRADOR']), BranchController.create);
router.put('/:id', authMiddleware, roleMiddleware(['ADMINISTRADOR']), BranchController.update);
router.patch('/:id/status', authMiddleware, roleMiddleware(['ADMINISTRADOR']), BranchController.toggleStatus);

module.exports = router;