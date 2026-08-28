const CustomerService = require('../services/customerService');

class CustomerController {
    static async getAll(req, res) {
        try {
            const customers = req.query.q
                ? await CustomerService.search(req.query.q)
                : await CustomerService.getAll();
            res.status(200).json({ success: true, data: customers });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message || 'Error al obtener los clientes.' });
        }
    }

    static async getById(req, res) {
        try {
            const customer = await CustomerService.getById(req.params.id);
            res.status(200).json({ success: true, data: customer });
        } catch (error) {
            const status = error.message.includes('no encontrado') ? 404 : 500;
            res.status(status).json({ success: false, message: error.message });
        }
    }

    static async create(req, res) {
        try {
            const customer = await CustomerService.create(req.body);
            res.status(201).json({ success: true, message: 'Cliente registrado correctamente.', data: customer });
        } catch (error) {
            const status = error.message.includes('ya está registrado') ? 409 : 400;
            res.status(status).json({ success: false, message: error.message });
        }
    }

    static async update(req, res) {
        try {
            const customer = await CustomerService.update(req.params.id, req.body);
            res.status(200).json({ success: true, message: 'Cliente actualizado correctamente.', data: customer });
        } catch (error) {
            let status = 400;
            if (error.message.includes('no encontrado')) status = 404;
            else if (error.message.includes('ya está registrado')) status = 409;
            res.status(status).json({ success: false, message: error.message });
        }
    }
}

module.exports = CustomerController;
