const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const UserModel = require('../models/User');

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

        return {
            token,
            user: {
                id: user.id_usuario,
                nombre: user.nombre,
                apellido: user.apellido,
                correo: user.correo,
                rol: user.rol
            }
        };
    }
}

module.exports = AuthService;
