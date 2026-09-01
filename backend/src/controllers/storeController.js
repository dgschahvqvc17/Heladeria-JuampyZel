const StoreService = require('../services/storeService');

class StoreController {
    static async getAll(req, res) {
        try {
            const stores = await StoreService.getAll();
            res.status(200).json({ success: true, data: stores });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message || 'Error al obtener las tiendas.' });
        }
    }

    static async getById(req, res) {
        try {
            const store = await StoreService.getById(req.params.id);
            res.status(200).json({ success: true, data: store });
        } catch (error) {
            const status = error.message.includes('no encontrada') ? 404 : 500;
            res.status(status).json({ success: false, message: error.message });
        }
    }

    static async create(req, res) {
        try {
            const store = await StoreService.create(req.body);
            res.status(201).json({ success: true, message: 'Tienda registrada correctamente.', data: store });
        } catch (error) {
            const status = error.message.includes('ya está registrado') ? 409 : 400;
            res.status(status).json({ success: false, message: error.message });
        }
    }

    static async update(req, res) {
        try {
            const store = await StoreService.update(req.params.id, req.body);
            res.status(200).json({ success: true, message: 'Tienda actualizada correctamente.', data: store });
        } catch (error) {
            let status = 400;
            if (error.message.includes('no encontrada')) status = 404;
            else if (error.message.includes('ya está registrado')) status = 409;
            res.status(status).json({ success: false, message: error.message });
        }
    }

    static async toggleStatus(req, res) {
        try {
            const store = await StoreService.toggleStatus(req.params.id);
            const statusMessage = store.estado ? 'activada' : 'desactivada';
            res.status(200).json({ success: true, message: `Tienda ${statusMessage} correctamente.`, data: store });
        } catch (error) {
            const status = error.message.includes('no encontrada') ? 404 : 500;
            res.status(status).json({ success: false, message: error.message });
        }
    }
}

module.exports = StoreController;