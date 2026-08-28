const pool = require('../config/database');

class Branch {
    static async findAll() {
        const [rows] = await pool.execute(
            `SELECT s.id_sucursal, s.nombre, s.direccion, s.telefono, s.id_responsable,
                    CONCAT(u.nombre, ' ', u.apellido) AS responsable, s.estado
             FROM sucursal s
             LEFT JOIN usuario u ON u.id_usuario = s.id_responsable
             ORDER BY s.id_sucursal DESC`
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.execute(
            `SELECT s.id_sucursal, s.nombre, s.direccion, s.telefono, s.id_responsable,
                    CONCAT(u.nombre, ' ', u.apellido) AS responsable, s.estado
             FROM sucursal s
             LEFT JOIN usuario u ON u.id_usuario = s.id_responsable
             WHERE s.id_sucursal = ?`,
            [id]
        );
        return rows[0];
    }

    static async findByName(nombre) {
        const [rows] = await pool.execute(
            'SELECT id_sucursal, nombre, direccion, telefono, id_responsable, estado FROM sucursal WHERE nombre = ?',
            [nombre]
        );
        return rows[0];
    }

    static async create({ nombre, direccion, telefono, id_responsable }) {
        const [result] = await pool.execute(
            'INSERT INTO sucursal (nombre, direccion, telefono, id_responsable) VALUES (?, ?, ?, ?)',
            [nombre, direccion, telefono, id_responsable]
        );
        return result.insertId;
    }

    static async update(id, { nombre, direccion, telefono, id_responsable }) {
        const [result] = await pool.execute(
            'UPDATE sucursal SET nombre = ?, direccion = ?, telefono = ?, id_responsable = ? WHERE id_sucursal = ?',
            [nombre, direccion, telefono, id_responsable, id]
        );
        return result.affectedRows;
    }

    static async updateStatus(id, estado) {
        const [result] = await pool.execute(
            'UPDATE sucursal SET estado = ? WHERE id_sucursal = ?',
            [estado, id]
        );
        return result.affectedRows;
    }

    static async findByResponsable(idResponsable) {
        const [rows] = await pool.execute(
            'SELECT id_sucursal, id_responsable FROM sucursal WHERE id_responsable = ?',
            [idResponsable]
        );
        return rows[0];
    }
}

module.exports = Branch;