const ProductService = require('../services/productService');

class ProductController {
    static async getAll(req, res) {
        try {
            const products = req.query.q
                ? await ProductService.search(req.query.q)
                : await ProductService.getAll();
            res.status(200).json({ success: true, data: products });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message || 'Error al obtener los productos.' });
        }
    }

    static async getActiveAll(req, res) {
        try {
            const products = await ProductService.getActiveAll();
            res.status(200).json({ success: true, data: products });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message || 'Error al obtener los productos.' });
        }
    }

    static async getById(req, res) {
        try {
            const product = await ProductService.getById(req.params.id);
            res.status(200).json({ success: true, data: product });
        } catch (error) {
            const status = error.message.includes('no encontrado') ? 404 : 500;
            res.status(status).json({ success: false, message: error.message });
        }
    }

    static async create(req, res) {
        try {
            const product = await ProductService.create(req.body);
            res.status(201).json({ success: true, message: 'Producto registrado correctamente.', data: product });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    static async update(req, res) {
        try {
            const product = await ProductService.update(req.params.id, req.body);
            res.status(200).json({ success: true, message: 'Producto actualizado correctamente.', data: product });
        } catch (error) {
            const status = error.message.includes('no encontrado') ? 404 : 400;
            res.status(status).json({ success: false, message: error.message });
        }
    }

    static async toggleStatus(req, res) {
        try {
            const product = await ProductService.toggleStatus(req.params.id);
            const statusMessage = product.estado ? 'activado' : 'desactivado';
            res.status(200).json({ success: true, message: `Producto ${statusMessage} correctamente.`, data: product });
        } catch (error) {
            const status = error.message.includes('no encontrado') ? 404 : 500;
            res.status(status).json({ success: false, message: error.message });
        }
    }
}

module.exports = ProductController;
