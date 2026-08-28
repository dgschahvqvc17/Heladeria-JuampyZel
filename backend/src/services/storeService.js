const Store = require('../models/Store');

class StoreService {
    static async getAll() {
        return Store.findAll();
    }

    static async getById(id) {
        const store = await Store.findById(id);
        if (!store) throw new Error('Tienda no encontrada.');
        return store;
    }

    static async create({ nombre, responsable, telefono, correo, direccion }) {
        this.validateFields({ nombre, responsable, correo, direccion });

        const existingStore = await Store.findByName(nombre.trim());
        if (existingStore) {
            throw new Error('El nombre comercial de la tienda ya está registrado.');
        }

        const storeId = await Store.create({
            nombre: nombre.trim(),
            responsable: responsable.trim(),
            telefono: telefono ? telefono.trim() : null,
            correo: correo ? correo.trim().toLowerCase() : null,
            direccion: direccion.trim()
        });

        return this.getById(storeId);
    }

    static async update(id, { nombre, responsable, telefono, correo, direccion }) {
        this.validateFields({ nombre, responsable, correo, direccion });

        const existingStore = await Store.findById(id);
        if (!existingStore) throw new Error('Tienda no encontrada.');

        const duplicateName = await Store.findByName(nombre.trim());
        if (duplicateName && duplicateName.id_tienda !== parseInt(id)) {
            throw new Error('El nombre comercial ya está registrado por otra tienda.');
        }

        await Store.update(id, {
            nombre: nombre.trim(),
            responsable: responsable.trim(),
            telefono: telefono ? telefono.trim() : null,
            correo: correo ? correo.trim().toLowerCase() : null,
            direccion: direccion.trim()
        });

        return this.getById(id);
    }

    static async toggleStatus(id) {
        const store = await Store.findById(id);
        if (!store) throw new Error('Tienda no encontrada.');

        await Store.updateStatus(id, !store.estado);
        return this.getById(id);
    }

    static validateFields({ nombre, responsable, correo, direccion }) {
        if (!nombre || !nombre.trim()) throw new Error('El nombre de la tienda es obligatorio.');
        if (nombre.trim().length < 2) throw new Error('El nombre debe tener al menos 2 caracteres.');

        if (!responsable || !responsable.trim()) throw new Error('El nombre del responsable es obligatorio.');
        if (responsable.trim().length < 2) throw new Error('El responsable debe tener al menos 2 caracteres.');

        if (!direccion || !direccion.trim()) throw new Error('La dirección es obligatoria.');
        if (direccion.trim().length < 5) throw new Error('La dirección debe tener al menos 5 caracteres.');

        if (correo && correo.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(correo.trim())) {
                throw new Error('El correo electrónico no tiene un formato válido.');
            }
        }
    }
}

module.exports = StoreService;