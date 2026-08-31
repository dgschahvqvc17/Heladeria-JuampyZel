const pool = require('../config/database');

class Product {
    static async findAll() {
        const [rows] = await pool.execute(
            `SELECT p.id_producto, p.id_categoria, p.nombre, p.descripcion, p.precio,
                    p.stock_minimo, p.imagen, p.estado,
                    c.nombre AS categoria_nombre
             FROM producto p
             INNER JOIN categoria c ON c.id_categoria = p.id_categoria
             ORDER BY p.nombre`
        );
        return rows;
    }

    static async findActiveAll() {
        const [rows] = await pool.execute(
            `SELECT p.id_producto, p.id_categoria, p.nombre, p.descripcion, p.precio,
                    p.stock_minimo, p.imagen, c.nombre AS categoria_nombre
             FROM producto p
             INNER JOIN categoria c ON c.id_categoria = p.id_categoria
             WHERE p.estado = 1 AND c.estado = 1
             ORDER BY p.nombre`
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.execute(
            `SELECT p.id_producto, p.id_categoria, p.nombre, p.descripcion, p.precio,
                    p.stock_minimo, p.imagen, p.estado,
                    c.nombre AS categoria_nombre
             FROM producto p
             INNER JOIN categoria c ON c.id_categoria = p.id_categoria
             WHERE p.id_producto = ?`,
            [id]
        );
        return rows[0];
    }

    static async search(term) {
        const like = `%${term}%`;
        const [rows] = await pool.execute(
            `SELECT p.id_producto, p.id_categoria, p.nombre, p.descripcion, p.precio,
                    p.stock_minimo, p.imagen, p.estado,
                    c.nombre AS categoria_nombre
             FROM producto p
             INNER JOIN categoria c ON c.id_categoria = p.id_categoria
             WHERE p.nombre LIKE ? OR p.descripcion LIKE ? OR c.nombre LIKE ?
             ORDER BY p.nombre`,
            [like, like, like]
        );
        return rows;
    }

    static async create({ id_categoria, nombre, descripcion, precio, stock_minimo, imagen, estado }) {
        const [result] = await pool.execute(
            `INSERT INTO producto (id_categoria, nombre, descripcion, precio, stock_minimo, imagen, estado)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [id_categoria, nombre, descripcion || null, precio, stock_minimo, imagen || null, estado]
        );
        return result.insertId;
    }

    static async update(id, { id_categoria, nombre, descripcion, precio, stock_minimo, imagen, estado }) {
        const [result] = await pool.execute(
            `UPDATE producto
             SET id_categoria = ?, nombre = ?, descripcion = ?, precio = ?,
                 stock_minimo = ?, imagen = ?, estado = ?
             WHERE id_producto = ?`,
            [id_categoria, nombre, descripcion || null, precio, stock_minimo, imagen || null, estado, id]
        );
        return result.affectedRows;
    }

    static async updateStatus(id, estado) {
        const [result] = await pool.execute(
            'UPDATE producto SET estado = ? WHERE id_producto = ?',
            [estado, id]
        );
        return result.affectedRows;
    }

    static async updateStockMinimo(id, stock_minimo) {
        const [result] = await pool.execute(
            'UPDATE producto SET stock_minimo = ? WHERE id_producto = ?',
            [stock_minimo, id]
        );
        return result.affectedRows;
    }
}

module.exports = Product;
