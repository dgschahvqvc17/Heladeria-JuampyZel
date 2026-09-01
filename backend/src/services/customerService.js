const Customer = require('../models/Customer');

class CustomerService {
    static async getAll() {
        return Customer.findAll();
    }

    static async getById(id) {
        const customer = await Customer.findById(id);
        if (!customer) throw new Error('Cliente no encontrado.');
        return customer;
    }

    static async search(term) {
        const trimmed = term ? term.trim() : '';
        if (!trimmed) return this.getAll();
        return Customer.search(trimmed);
    }

    static async create({ nombres, apellidos, telefono, correo, direccion }) {
        this.validateFields({ nombres, apellidos, correo });

        if (correo && correo.trim()) {
            const existing = await Customer.findByEmail(correo.trim().toLowerCase());
            if (existing) throw new Error('El correo electrónico ya está registrado.');
        }

        const customerId = await Customer.create({
            nombres: nombres.trim(),
            apellidos: apellidos.trim(),
            telefono: telefono ? telefono.trim() : null,
            correo: correo ? correo.trim() : null,
            direccion: direccion ? direccion.trim() : null
        });

        return this.getById(customerId);
    }

    static async update(id, { nombres, apellidos, telefono, correo, direccion }) {
        this.validateFields({ nombres, apellidos, correo });

        const existingCustomer = await Customer.findById(id);
        if (!existingCustomer) throw new Error('Cliente no encontrado.');

        if (correo && correo.trim()) {
            const duplicate = await Customer.findByEmail(correo.trim().toLowerCase());
            if (duplicate && duplicate.id_cliente !== parseInt(id)) {
                throw new Error('El correo electrónico ya está registrado por otro cliente.');
            }
        }

        await Customer.update(id, {
            nombres: nombres.trim(),
            apellidos: apellidos.trim(),
            telefono: telefono ? telefono.trim() : null,
            correo: correo ? correo.trim() : null,
            direccion: direccion ? direccion.trim() : null
        });

        return this.getById(id);
    }

    static validateFields({ nombres, apellidos, correo }) {
        if (!nombres || !nombres.trim()) {
            throw new Error('Los nombres son obligatorios.');
        }
        if (nombres.trim().length < 2) {
            throw new Error('Los nombres deben tener al menos 2 caracteres.');
        }

        if (!apellidos || !apellidos.trim()) {
            throw new Error('Los apellidos son obligatorios.');
        }
        if (apellidos.trim().length < 2) {
            throw new Error('Los apellidos deben tener al menos 2 caracteres.');
        }

        if (correo && correo.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(correo.trim())) {
                throw new Error('El correo electrónico no tiene un formato válido.');
            }
        }
    }
}

module.exports = CustomerService;
