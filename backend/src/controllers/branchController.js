const BranchService = require('../services/branchService');

class BranchController {
    static async getAll(req, res) {
        try {
            const branches = await BranchService.getAll();
            res.status(200).json({ success: true, data: branches });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message || 'Error al obtener las sucursales.' });
        }
    }

    static async getAvailableManagers(req, res) {
        try {
            const managers = await BranchService.getAvailableManagers();
            res.status(200).json({ success: true, data: managers });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message || 'Error al obtener los encargados disponibles.' });
        }
    }

    static async getById(req, res) {
        try {
            const branch = await BranchService.getById(req.params.id);
            res.status(200).json({ success: true, data: branch });
        } catch (error) {
            const status = error.message.includes('no encontrada') ? 404 : 500;
            res.status(status).json({ success: false, message: error.message });
        }
    }

    static async create(req, res) {
        try {
            const branch = await BranchService.create(req.body);
            res.status(201).json({ success: true, message: 'Sucursal registrada correctamente.', data: branch });
        } catch (error) {
            const status = error.message.includes('ya está registrado') ? 409 : 400;
            res.status(status).json({ success: false, message: error.message });
        }
    }

    static async update(req, res) {
        try {
            const branch = await BranchService.update(req.params.id, req.body);
            res.status(200).json({ success: true, message: 'Sucursal actualizada correctamente.', data: branch });
        } catch (error) {
            let status = 400;
            if (error.message.includes('no encontrada')) status = 404;
            else if (error.message.includes('ya está registrado')) status = 409;
            res.status(status).json({ success: false, message: error.message });
        }
    }

    static async toggleStatus(req, res) {
        try {
            const branch = await BranchService.toggleStatus(req.params.id);
            const statusMessage = branch.estado ? 'activada' : 'desactivada';
            res.status(200).json({ success: true, message: `Sucursal ${statusMessage} correctamente.`, data: branch });
        } catch (error) {
            const status = error.message.includes('no encontrada') ? 404 : 500;
            res.status(status).json({ success: false, message: error.message });
        }
    }
}

module.exports = BranchController;