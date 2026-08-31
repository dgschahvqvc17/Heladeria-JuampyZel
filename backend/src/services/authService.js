const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const UserModel = require('../models/User');
const Store = require('../models/Store');

class AuthService {
    static async login(correo, password) {
        const user = await UserModel.findByEmail(correo);

        if (!user) {
            throw new Error('Credenciales incorrectas');
        }

        if (!user.estado) {
            throw new Error('Usuario inactivo. Contacte al administrador.');
        }

        const passwordValid = await bcrypt.compare(password, user.password);

        if (!passwordValid) {
            throw new Error('Credenciales incorrectas');
        }

        const token = jwt.sign(
            {
                id_usuario: user.id_usuario,
                correo: user.correo,
                rol: user.rol
            },
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn }
        );

        const userData = {
            id: user.id_usuario,
            nombre: user.nombre,
            apellido: user.apellido,
            correo: user.correo,
            rol: user.rol
        };

        if (user.rol === 'TIENDA') {
            const store = await Store.findByUserId(user.id_usuario);
            if (!store) {
                throw new Error('No se encontró una tienda vinculada a esta cuenta.');
            }
            if (!store.estado) {
                throw new Error('La tienda vinculada a esta cuenta está desactivada.');
            }
            userData.tienda = {
                id_tienda: store.id_tienda,
                nombre: store.nombre
            };
        }

        return {
            token,
            user: userData
        };
    }

    static async changePassword({ idUsuario, passwordActual, passwordNueva }) {
        if (!passwordActual || !passwordActual.trim()) {
            throw new Error('Debe ingresar su contraseña actual.');
        }

        if (!passwordNueva || !passwordNueva.trim()) {
            throw new Error('Debe ingresar la nueva contraseña.');
        }

        if (passwordNueva.length < 6) {
            throw new Error('La nueva contraseña debe tener al menos 6 caracteres.');
        }

        const user = await UserModel.findByIdWithPassword(idUsuario);
        if (!user) {
            throw new Error('Usuario no encontrado.');
        }

        const passwordValid = await bcrypt.compare(passwordActual, user.password);
        if (!passwordValid) {
            throw new Error('La contraseña actual es incorrecta.');
        }

        if (passwordNueva === passwordActual) {
            throw new Error('La nueva contraseña debe ser diferente a la actual.');
        }

        const hashedPassword = await bcrypt.hash(passwordNueva, 10);
        await UserModel.updatePassword(idUsuario, hashedPassword);

        return true;
    }
}

module.exports = AuthService;
