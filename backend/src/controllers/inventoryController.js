const InventoryService = require('../services/inventoryService');

class InventoryController {
    static async getStock(req, res) {
        try {
            const stock = await InventoryService.getStock({ q: req.query.q });
            res.status(200).json({ success: true, data: stock });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message || 'Error al obtener el inventario.' });
        }
    }

    static async getLowStock(req, res) {
        try {
            const lowStock = await InventoryService.getLowStock();
            res.status(200).json({ success: true, data: lowStock });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message || 'Error al obtener los productos con bajo stock.' });
        }
    }

    static async getMovements(req, res) {
        try {
            const filters = {
                producto: req.query.producto || null,
                sucursal: req.query.sucursal || null,
                tipo: req.query.tipo || null
            };
            const movements = await InventoryService.getMovements(filters);
            res.status(200).json({ success: true, data: movements });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message || 'Error al obtener los movimientos de inventario.' });
        }
    }

    static async getMovementById(req, res) {
        try {
            const movement = await InventoryService.getMovementById(req.params.id);
            res.status(200).json({ success: true, data: movement });
        } catch (error) {
            const status = error.message.includes('no encontrado') ? 404 : 500;
            res.status(status).json({ success: false, message: error.message });
        }
    }

    static async createMovement(req, res) {
        try {
            const movement = await InventoryService.registerMovement(req.body, req.user.id_usuario);
            res.status(201).json({ success: true, message: 'Movimiento de inventario registrado correctamente.', data: movement });
        } catch (error) {
            const status = error.message.includes('no encontrado') ? 404 : 400;
            res.status(status).json({ success: false, message: error.message });
        }
    }

    static async adjustStock(req, res) {
        try {
            const result = await InventoryService.adjustTotalStock(
                { id_producto: req.params.id, nuevo_stock: req.body.nuevo_stock, motivo: req.body.motivo },
                req.user.id_usuario
            );
            res.status(200).json({ success: true, message: 'Stock del producto ajustado correctamente.', data: result });
        } catch (error) {
            const status = error.message.includes('no encontrado') ? 404 : 400;
            res.status(status).json({ success: false, message: error.message });
        }
    }

    static async updateStockMinimo(req, res) {
        try {
            const result = await InventoryService.updateStockMinimo(
                { id_producto: req.params.id, stock_minimo: req.body.stock_minimo }
            );
            res.status(200).json({ success: true, message: 'Stock mínimo del producto actualizado correctamente.', data: result });
        } catch (error) {
            const status = error.message.includes('no encontrado') ? 404 : 400;
            res.status(status).json({ success: false, message: error.message });
        }
    }
}

module.exports = InventoryController;