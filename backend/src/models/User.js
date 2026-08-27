const pool = require('../config/database');

class User {
    static async findByEmail(correo) {
        const [rows] = await pool.execute(
            'SELECT id_usuario, nombre, apellido, correo, password, rol, estado, fecha_registro FROM usuario WHERE correo = ?',
            [correo]
        );
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await pool.execute(
            'SELECT id_usuario, nombre, apellido, correo, rol, estado, fecha_registro FROM usuario WHERE id_usuario = ?',
            [id]
        );
        return rows[0];
    }
}

module.exports = User;
