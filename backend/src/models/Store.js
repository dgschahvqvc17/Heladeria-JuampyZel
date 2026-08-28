const pool = require('../config/database');

class Store {
    static async findAll() {
        const [rows] = await pool.execute(
            'SELECT id_tienda, id_usuario, nombre, responsable, telefono, correo, direccion, estado, fecha_registro FROM tienda ORDER BY id_tienda DESC'
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.execute(
            'SELECT id_tienda, id_usuario, nombre, responsable, telefono, correo, direccion, estado, fecha_registro FROM tienda WHERE id_tienda = ?',
            [id]
        );
        return rows[0];
    }

    static async findByName(nombre) {
        const [rows] = await pool.execute(
            'SELECT id_tienda, nombre FROM tienda WHERE nombre = ?',
            [nombre]
        );
        return rows[0];
    }

    static async create({ nombre, responsable, telefono, correo, direccion }) {
        const [result] = await pool.execute(
            'INSERT INTO tienda (nombre, responsable, telefono, correo, direccion) VALUES (?, ?, ?, ?, ?)',
            [nombre, responsable, telefono || null, correo || null, direccion]
        );
        return result.insertId;
    }

    static async update(id, { nombre, responsable, telefono, correo, direccion }) {
        const [result] = await pool.execute(
            'UPDATE tienda SET nombre = ?, responsable = ?, telefono = ?, correo = ?, direccion = ? WHERE id_tienda = ?',
            [nombre, responsable, telefono || null, correo || null, direccion, id]
        );
        return result.affectedRows;
    }

    static async updateStatus(id, estado) {
        const [result] = await pool.execute(
            'UPDATE tienda SET estado = ? WHERE id_tienda = ?',
            [estado, id]
        );
        return result.affectedRows;
    }
}

module.exports = Store;