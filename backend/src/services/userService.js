const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Store = require('../models/Store');

const VALID_ROLES = ['ADMINISTRADOR', 'ENCARGADO_SUCURSAL', 'VENDEDOR', 'INVENTARIO', 'TIENDA'];
const SALT_ROUNDS = 10;

class UserService {
    static async getAll() {
        const users = await User.findAll();

        for (const user of users) {
            if (user.rol === 'TIENDA') {
                user.tienda = await Store.findByUserId(user.id_usuario);
            }
        }

        return users;
    }

    static async getById(id) {
        const user = await User.findById(id);

        if (!user) {
            throw new Error('Usuario no encontrado.');
        }

        if (user.rol === 'TIENDA') {
            const store = await Store.findByUserId(user.id_usuario);
            user.tienda = store || null;
        }

        return user;
    }

    static async create({ nombre, apellido, correo, password, rol, tienda }) {
        this.validateFields({ nombre, apellido, correo, password, rol });
        if (rol === 'TIENDA') this.validateStoreFields(tienda);

        const existingUser = await User.findByEmail(correo);

        if (existingUser) {
            throw new Error('El correo electrónico ya está registrado.');
        }

        if (rol === 'TIENDA') {
            const existingStore = await Store.findByName(tienda.nombre.trim());
            if (existingStore) {
                throw new Error('El nombre comercial de la tienda ya está registrado.');
            }
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const userId = await User.create({
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            correo: correo.trim().toLowerCase(),
            password: hashedPassword,
            rol
        });

        if (rol === 'TIENDA') {
            await Store.create({
                id_usuario: userId,
                ...this.prepareStoreData(tienda)
            });
        }

        return this.getById(userId);
    }

    static async update(id, { nombre, apellido, correo, rol, tienda }) {
        this.validateFields({ nombre, apellido, correo, rol });
        if (rol === 'TIENDA') this.validateStoreFields(tienda);

        const existingUser = await User.findById(id);

        if (!existingUser) {
            throw new Error('Usuario no encontrado.');
        }

        const duplicateEmail = await User.findByEmail(correo.trim().toLowerCase());

        if (duplicateEmail && duplicateEmail.id_usuario !== parseInt(id)) {
            throw new Error('El correo electrónico ya está registrado por otro usuario.');
        }

        await User.update(id, {
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            correo: correo.trim().toLowerCase(),
            rol
        });

        if (rol === 'TIENDA') {
            const store = await Store.findByUserId(id);
            const storeData = this.prepareStoreData(tienda);

            const existingStore = await Store.findByName(tienda.nombre.trim());
            if (existingStore && (!store || existingStore.id_tienda !== store.id_tienda)) {
                throw new Error('El nombre comercial de la tienda ya está registrado.');
            }

            if (store) {
                await Store.update(store.id_tienda, storeData);
            } else {
                await Store.create({ id_usuario: id, ...storeData });
            }
        }

        return this.getById(id);
    }

    static async toggleStatus(id) {
        const user = await User.findById(id);

        if (!user) {
            throw new Error('Usuario no encontrado.');
        }

        const newStatus = !user.estado;
        await User.updateStatus(id, newStatus);

        return this.getById(id);
    }

    static validateStoreFields(tienda) {
        if (!tienda) {
            throw new Error('Debe completar los datos de la tienda.');
        }

        if (!tienda.nombre || !tienda.nombre.trim()) {
            throw new Error('El nombre comercial de la tienda es obligatorio.');
        }
        if (tienda.nombre.trim().length < 2) {
            throw new Error('El nombre comercial de la tienda debe tener al menos 2 caracteres.');
        }

        if (!tienda.responsable || !tienda.responsable.trim()) {
            throw new Error('El responsable de la tienda es obligatorio.');
        }
        if (tienda.responsable.trim().length < 2) {
            throw new Error('El responsable de la tienda debe tener al menos 2 caracteres.');
        }

        if (!tienda.direccion || !tienda.direccion.trim()) {
            throw new Error('La dirección de la tienda es obligatoria.');
        }
        if (tienda.direccion.trim().length < 5) {
            throw new Error('La dirección de la tienda debe tener al menos 5 caracteres.');
        }

        if (tienda.correo && tienda.correo.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(tienda.correo.trim())) {
                throw new Error('El correo de la tienda no tiene un formato válido.');
            }
        }
    }

    static prepareStoreData(tienda) {
        return {
            nombre: tienda.nombre.trim(),
            responsable: tienda.responsable.trim(),
            telefono: tienda.telefono ? tienda.telefono.trim() : null,
            correo: tienda.correo ? tienda.correo.trim() : null,
            direccion: tienda.direccion.trim()
        };
    }

    static validateFields({ nombre, apellido, correo, password, rol }) {
        if (!nombre || !nombre.trim()) {
            throw new Error('El nombre es obligatorio.');
        }

        if (nombre.trim().length < 2) {
            throw new Error('El nombre debe tener al menos 2 caracteres.');
        }

        if (!apellido || !apellido.trim()) {
            throw new Error('El apellido es obligatorio.');
        }

        if (apellido.trim().length < 2) {
            throw new Error('El apellido debe tener al menos 2 caracteres.');
        }

        if (!correo || !correo.trim()) {
            throw new Error('El correo electrónico es obligatorio.');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(correo.trim())) {
            throw new Error('El correo electrónico no tiene un formato válido.');
        }

        if (password !== undefined && (!password || !password.trim())) {
            throw new Error('La contraseña es obligatoria.');
        }

        if (password && password.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres.');
        }

        if (rol !== undefined) {
            if (!VALID_ROLES.includes(rol)) {
                throw new Error('El rol seleccionado no es válido.');
            }
        }
    }
}

module.exports = UserService;
