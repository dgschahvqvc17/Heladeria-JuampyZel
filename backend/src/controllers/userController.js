const UserService = require('../services/userService');

class UserController {
    static async getAll(req, res) {
        try {
            const users = await UserService.getAll();

            res.status(200).json({
                success: true,
                data: users
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error al obtener los usuarios.'
            });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const user = await UserService.getById(id);

            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            const status = error.message.includes('no encontrado') ? 404 : 500;

            res.status(status).json({
                success: false,
                message: error.message || 'Error al obtener el usuario.'
            });
        }
    }

    static async create(req, res) {
        try {
            const { nombre, apellido, correo, password, rol, tienda } = req.body;
            const user = await UserService.create({ nombre, apellido, correo, password, rol, tienda });

            res.status(201).json({
                success: true,
                message: 'Usuario registrado correctamente.',
                data: user
            });
        } catch (error) {
            const status = error.message.includes('ya está registrado') ? 409 : 400;

            res.status(status).json({
                success: false,
                message: error.message || 'Error al registrar el usuario.'
            });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { nombre, apellido, correo, rol, tienda } = req.body;
            const user = await UserService.update(id, { nombre, apellido, correo, rol, tienda });

            res.status(200).json({
                success: true,
                message: 'Usuario actualizado correctamente.',
                data: user
            });
        } catch (error) {
            let status = 400;

            if (error.message.includes('no encontrado')) {
                status = 404;
            } else if (error.message.includes('ya está registrado')) {
                status = 409;
            }

            res.status(status).json({
                success: false,
                message: error.message || 'Error al actualizar el usuario.'
            });
        }
    }

    static async toggleStatus(req, res) {
        try {
            const { id } = req.params;
            const user = await UserService.toggleStatus(id);

            const statusMessage = user.estado ? 'activado' : 'desactivado';

            res.status(200).json({
                success: true,
                message: `Usuario ${statusMessage} correctamente.`,
                data: user
            });
        } catch (error) {
            const status = error.message.includes('no encontrado') ? 404 : 500;

            res.status(status).json({
                success: false,
                message: error.message || 'Error al cambiar el estado del usuario.'
            });
        }
    }
}

module.exports = UserController;
