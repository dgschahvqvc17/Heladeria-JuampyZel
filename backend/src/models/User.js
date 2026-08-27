const pool = require('../config/database');

class User {
    static async findAll() {
        const [rows] = await pool.execute(
            'SELECT id_usuario, nombre, apellido, correo, rol, estado, fecha_registro FROM usuario ORDER BY fecha_registro DESC'
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.execute(
            'SELECT id_usuario, nombre, apellido, correo, rol, estado, fecha_registro FROM usuario WHERE id_usuario = ?',
            [id]
        );
        return rows[0];
    }

    static async findByEmail(correo) {
        const [rows] = await pool.execute(
            'SELECT id_usuario, nombre, apellido, correo, password, rol, estado, fecha_registro FROM usuario WHERE correo = ?',
            [correo]
        );
        return rows[0];
    }

    static async create({ nombre, apellido, correo, password, rol }) {
        const [result] = await pool.execute(
            'INSERT INTO usuario (nombre, apellido, correo, password, rol) VALUES (?, ?, ?, ?, ?)',
            [nombre, apellido, correo, password, rol]
        );
        return result.insertId;
    }

    static async update(id, { nombre, apellido, correo, rol }) {
        const [result] = await pool.execute(
            'UPDATE usuario SET nombre = ?, apellido = ?, correo = ?, rol = ? WHERE id_usuario = ?',
            [nombre, apellido, correo, rol, id]
        );
        return result.affectedRows;
    }

    static async updatePassword(id, password) {
        const [result] = await pool.execute(
            'UPDATE usuario SET password = ? WHERE id_usuario = ?',
            [password, id]
        );
        return result.affectedRows;
    }

    static async updateStatus(id, estado) {
        const [result] = await pool.execute(
            'UPDATE usuario SET estado = ? WHERE id_usuario = ?',
            [estado, id]
        );
        return result.affectedRows;
    }
}

module.exports = User;
