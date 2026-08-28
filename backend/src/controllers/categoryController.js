const CategoryService = require('../services/categoryService');

class CategoryController {
    static async getAll(req, res) {
        try {
            const categories = await CategoryService.getAll();
            res.status(200).json({ success: true, data: categories });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message || 'Error al obtener las categorías.' });
        }
    }

    static async getActiveAll(req, res) {
        try {
            const categories = await CategoryService.getActiveAll();
            res.status(200).json({ success: true, data: categories });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message || 'Error al obtener las categorías.' });
        }
    }

    static async getById(req, res) {
        try {
            const category = await CategoryService.getById(req.params.id);
            res.status(200).json({ success: true, data: category });
        } catch (error) {
            const status = error.message.includes('no encontrada') ? 404 : 500;
            res.status(status).json({ success: false, message: error.message });
        }
    }

    static async create(req, res) {
        try {
            const category = await CategoryService.create(req.body);
            res.status(201).json({ success: true, message: 'Categoría registrada correctamente.', data: category });
        } catch (error) {
            const status = error.message.includes('ya está registrada') ? 409 : 400;
            res.status(status).json({ success: false, message: error.message });
        }
    }

    static async update(req, res) {
        try {
            const category = await CategoryService.update(req.params.id, req.body);
            res.status(200).json({ success: true, message: 'Categoría actualizada correctamente.', data: category });
        } catch (error) {
            let status = 400;
            if (error.message.includes('no encontrada')) status = 404;
            else if (error.message.includes('ya está registrada')) status = 409;
            res.status(status).json({ success: false, message: error.message });
        }
    }

    static async toggleStatus(req, res) {
        try {
            const category = await CategoryService.toggleStatus(req.params.id);
            const statusMessage = category.estado ? 'activada' : 'desactivada';
            res.status(200).json({ success: true, message: `Categoría ${statusMessage} correctamente.`, data: category });
        } catch (error) {
            const status = error.message.includes('no encontrada') ? 404 : 500;
            res.status(status).json({ success: false, message: error.message });
        }
    }
}

module.exports = CategoryController;
