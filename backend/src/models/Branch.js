const pool = require('../config/database');

class Branch {
    static async findAll() {
        const [rows] = await pool.execute(
            'SELECT id_sucursal, nombre, direccion, telefono, responsable, estado FROM sucursal ORDER BY id_sucursal DESC'
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.execute(
            'SELECT id_sucursal, nombre, direccion, telefono, responsable, estado FROM sucursal WHERE id_sucursal = ?',
            [id]
        );
        return rows[0];
    }

    static async findByName(nombre) {
        const [rows] = await pool.execute(
            'SELECT id_sucursal, nombre, direccion, telefono, responsable, estado FROM sucursal WHERE nombre = ?',
            [nombre]
        );
        return rows[0];
    }

    static async create({ nombre, direccion, telefono, responsable }) {
        const [result] = await pool.execute(
            'INSERT INTO sucursal (nombre, direccion, telefono, responsable) VALUES (?, ?, ?, ?)',
            [nombre, direccion, telefono, responsable]
        );
        return result.insertId;
    }

    static async update(id, { nombre, direccion, telefono, responsable }) {
        const [result] = await pool.execute(
            'UPDATE sucursal SET nombre = ?, direccion = ?, telefono = ?, responsable = ? WHERE id_sucursal = ?',
            [nombre, direccion, telefono, responsable, id]
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
}

module.exports = Branch;