const ReportService = require('../services/reportService');

class ReportController {
    static async getSalesReport(req, res) {
        try {
            const sales = await ReportService.getSales(req.query);
            const summary = await ReportService.getSalesSummary(req.query);
            res.status(200).json({ success: true, data: { sales, summary } });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message || 'Error al obtener el reporte de ventas.' });
        }
    }

    static async getOrdersReport(req, res) {
        try {
            const orders = await ReportService.getOrders(req.query);
            const summary = await ReportService.getOrdersSummary(req.query);
            res.status(200).json({ success: true, data: { orders, summary } });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message || 'Error al obtener el reporte de pedidos.' });
        }
    }

    static async getProductsReport(req, res) {
        try {
            const products = await ReportService.getProducts();
            const summary = await ReportService.getProductsSummary();
            res.status(200).json({ success: true, data: { products, summary } });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message || 'Error al obtener el reporte de productos.' });
        }
    }

    static async getInventoryReport(req, res) {
        try {
            const movements = await ReportService.getInventory(req.query);
            const summary = await ReportService.getInventorySummary(req.query);
            res.status(200).json({ success: true, data: { movements, summary } });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message || 'Error al obtener el reporte de inventario.' });
        }
    }

    static async getDashboard(req, res) {
        try {
            const data = await ReportService.getDashboard();
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message || 'Error al obtener los datos del dashboard.' });
        }
    }
}

module.exports = ReportController;
