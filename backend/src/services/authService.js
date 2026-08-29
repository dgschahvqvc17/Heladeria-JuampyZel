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
}

module.exports = AuthService;
