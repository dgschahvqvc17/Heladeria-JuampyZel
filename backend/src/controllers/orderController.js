const OrderService = require('../services/orderService');

class OrderController {
    static async getAll(req, res) {
        try {
            const orders = await OrderService.getAll(req.user);
            res.status(200).json({ success: true, data: orders });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message || 'Error al obtener los pedidos.' });
        }
    }

    static async getById(req, res) {
        try {
            const order = await OrderService.getById(req.params.id, req.user);
            res.status(200).json({ success: true, data: order });
        } catch (error) {
            const status = error.message.includes('no encontrado') ? 404 : 500;
            res.status(status).json({ success: false, message: error.message });
        }
    }

    static async getCatalog(req, res) {
        try {
            const products = await OrderService.getCatalog();
            res.status(200).json({ success: true, data: products });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message || 'Error al obtener el catálogo.' });
        }
    }

    static async create(req, res) {
        try {
            const order = await OrderService.create(req.body, req.user.id_usuario);
            res.status(201).json({ success: true, message: 'Pedido registrado correctamente.', data: order });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    static async updateStatus(req, res) {
        try {
            const order = await OrderService.updateStatus(req.params.id, req.body.estado, req.user);
            res.status(200).json({ success: true, message: 'Estado del pedido actualizado correctamente.', data: order });
        } catch (error) {
            const status = error.message.includes('no encontrado') ? 404 : 400;
            res.status(status).json({ success: false, message: error.message });
        }
    }
}

module.exports = OrderController;
