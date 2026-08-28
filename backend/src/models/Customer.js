const pool = require('../config/database');

class Customer {
    static async findAll() {
        const [rows] = await pool.execute(
            `SELECT id_cliente, nombres, apellidos, telefono, correo, direccion, fecha_registro
             FROM cliente
             ORDER BY id_cliente DESC`
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.execute(
            `SELECT id_cliente, nombres, apellidos, telefono, correo, direccion, fecha_registro
             FROM cliente
             WHERE id_cliente = ?`,
            [id]
        );
        return rows[0];
    }

    static async findByEmail(correo) {
        const [rows] = await pool.execute(
            'SELECT id_cliente, correo FROM cliente WHERE correo = ?',
            [correo]
        );
        return rows[0];
    }

    static async search(term) {
        const like = `%${term}%`;
        const [rows] = await pool.execute(
            `SELECT id_cliente, nombres, apellidos, telefono, correo, direccion, fecha_registro
             FROM cliente
             WHERE nombres LIKE ? OR apellidos LIKE ? OR correo LIKE ? OR telefono LIKE ?
             ORDER BY id_cliente DESC`,
            [like, like, like, like]
        );
        return rows;
    }

    static async create({ nombres, apellidos, telefono, correo, direccion }) {
        const [result] = await pool.execute(
            'INSERT INTO cliente (nombres, apellidos, telefono, correo, direccion) VALUES (?, ?, ?, ?, ?)',
            [nombres, apellidos, telefono || null, correo ? correo.toLowerCase() : null, direccion || null]
        );
        return result.insertId;
    }

    static async update(id, { nombres, apellidos, telefono, correo, direccion }) {
        const [result] = await pool.execute(
            'UPDATE cliente SET nombres = ?, apellidos = ?, telefono = ?, correo = ?, direccion = ? WHERE id_cliente = ?',
            [nombres, apellidos, telefono || null, correo ? correo.toLowerCase() : null, direccion || null, id]
        );
        return result.affectedRows;
    }
}

module.exports = Customer;
