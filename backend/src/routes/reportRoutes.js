const { Router } = require('express');
const ReportController = require('../controllers/reportController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = Router();

const REPORT_ROLES = ['ADMINISTRADOR'];
const DASHBOARD_ROLES = ['ADMINISTRADOR', 'ENCARGADO_SUCURSAL', 'INVENTARIO', 'VENDEDOR'];

// Reportes básicos (HU12): restringidos al administrador.
router.get('/sales', authMiddleware, roleMiddleware(REPORT_ROLES), ReportController.getSalesReport);
router.get('/orders', authMiddleware, roleMiddleware(REPORT_ROLES), ReportController.getOrdersReport);
router.get('/products', authMiddleware, roleMiddleware(REPORT_ROLES), ReportController.getProductsReport);
router.get('/inventory', authMiddleware, roleMiddleware(REPORT_ROLES), ReportController.getInventoryReport);

// Datos para el dashboard: disponible para los roles con acceso al panel.
router.get('/dashboard', authMiddleware, roleMiddleware(DASHBOARD_ROLES), ReportController.getDashboard);

module.exports = router;
