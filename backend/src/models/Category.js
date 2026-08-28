const pool = require('../config/database');

class Category {
    static async findAll() {
        const [rows] = await pool.execute(
            `SELECT c.id_categoria, c.nombre, c.descripcion, c.estado,
                    (SELECT COUNT(*) FROM producto p WHERE p.id_categoria = c.id_categoria) AS cantidad_productos
             FROM categoria c
             ORDER BY c.nombre`
        );
        return rows;
    }

    static async findActiveAll() {
        const [rows] = await pool.execute(
            'SELECT id_categoria, nombre FROM categoria WHERE estado = 1 ORDER BY nombre'
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.execute(
            'SELECT id_categoria, nombre, descripcion, estado FROM categoria WHERE id_categoria = ?',
            [id]
        );
        return rows[0];
    }

    static async findByName(nombre) {
        const [rows] = await pool.execute(
            'SELECT id_categoria, nombre FROM categoria WHERE nombre = ?',
            [nombre]
        );
        return rows[0];
    }

    static async create({ nombre, descripcion }) {
        const [result] = await pool.execute(
            'INSERT INTO categoria (nombre, descripcion) VALUES (?, ?)',
            [nombre, descripcion || null]
        );
        return result.insertId;
    }

    static async update(id, { nombre, descripcion }) {
        const [result] = await pool.execute(
            'UPDATE categoria SET nombre = ?, descripcion = ? WHERE id_categoria = ?',
            [nombre, descripcion || null, id]
        );
        return result.affectedRows;
    }

    static async updateStatus(id, estado) {
        const [result] = await pool.execute(
            'UPDATE categoria SET estado = ? WHERE id_categoria = ?',
            [estado, id]
        );
        return result.affectedRows;
    }
}

module.exports = Category;
