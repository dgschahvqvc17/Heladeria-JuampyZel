const bcrypt = require('bcryptjs');
const User = require('../models/User');

const VALID_ROLES = ['ADMINISTRADOR', 'ENCARGADO_SUCURSAL', 'VENDEDOR', 'INVENTARIO'];
const SALT_ROUNDS = 10;

class UserService {
    static async getAll() {
        return User.findAll();
    }

    static async getById(id) {
        const user = await User.findById(id);

        if (!user) {
            throw new Error('Usuario no encontrado.');
        }

        return user;
    }

    static async create({ nombre, apellido, correo, password, rol }) {
        this.validateFields({ nombre, apellido, correo, password, rol });

        const existingUser = await User.findByEmail(correo);

        if (existingUser) {
            throw new Error('El correo electrónico ya está registrado.');
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const userId = await User.create({
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            correo: correo.trim().toLowerCase(),
            password: hashedPassword,
            rol
        });

        return this.getById(userId);
    }

    static async update(id, { nombre, apellido, correo, rol }) {
        this.validateFields({ nombre, apellido, correo, rol });

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
