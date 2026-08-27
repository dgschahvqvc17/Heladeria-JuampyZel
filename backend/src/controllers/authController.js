const AuthService = require('../services/authService');

class AuthController {
    static async login(req, res, next) {
        try {
            const { correo, password } = req.body;

            if (!correo || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'El correo y la contraseña son obligatorios.'
                });
            }

            const result = await AuthService.login(correo, password);

            res.status(200).json({
                success: true,
                message: 'Inicio de sesión exitoso.',
                data: result
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: error.message || 'Error al iniciar sesión.'
            });
        }
    }

    static async logout(req, res) {
        res.status(200).json({
            success: true,
            message: 'Sesión cerrada correctamente.'
        });
    }

    static async me(req, res) {
        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: req.user.id_usuario,
                    correo: req.user.correo,
                    rol: req.user.rol
                }
            }
        });
    }
}

module.exports = AuthController;
