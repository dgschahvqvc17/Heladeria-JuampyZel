const { Router } = require('express');
const AlertController = require('../controllers/alertController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = Router();

const ALERT_ROLES = ['ADMINISTRADOR', 'INVENTARIO'];

router.get('/', authMiddleware, roleMiddleware(ALERT_ROLES), AlertController.getAll);
router.get('/:id', authMiddleware, roleMiddleware(ALERT_ROLES), AlertController.getById);
router.patch('/:id/attend', authMiddleware, roleMiddleware(ALERT_ROLES), AlertController.attend);

module.exports = router;