const SaleService = require('../services/saleService');

class SaleController {
    static async getAll(req, res) {
        try {
            const branchId = req.query.branch || null;
            const sales = await SaleService.getAll(branchId);
            res.status(200).json({ success: true, data: sales });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message || 'Error al obtener las ventas.' });
        }
    }

    static async getById(req, res) {
        try {
            const sale = await SaleService.getById(req.params.id);
            res.status(200).json({ success: true, data: sale });
        } catch (error) {
            const status = error.message.includes('no encontrada') ? 404 : 500;
            res.status(status).json({ success: false, message: error.message });
        }
    }

    static async getProductsByBranch(req, res) {
        try {
            const products = await SaleService.getProductsByBranch(req.query.sucursal);
            res.status(200).json({ success: true, data: products });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message || 'Error al obtener los productos.' });
        }
    }

    static async create(req, res) {
        try {
            const sale = await SaleService.create(req.body, req.user.id_usuario);
            res.status(201).json({ success: true, message: 'Venta registrada correctamente.', data: sale });
        } catch (error) {
            const status = error.message.includes('no encontrada') ? 404 : 400;
            res.status(status).json({ success: false, message: error.message });
        }
    }
}

module.exports = SaleController;
