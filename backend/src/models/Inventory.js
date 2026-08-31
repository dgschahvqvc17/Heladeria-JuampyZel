const pool = require('../config/database');

class Inventory {
    static async findStock({ term, lowStockOnly } = {}) {
        const where = [];
        const params = [];

        if (term) {
            const like = `%${term}%`;
            where.push('(p.nombre LIKE ? OR p.descripcion LIKE ? OR c.nombre LIKE ?)');
            params.push(like, like, like);
        }

        const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';
        const havingClause = lowStockOnly ? 'HAVING bajo_stock = 1' : '';

        const [rows] = await pool.execute(
            `SELECT p.id_producto, p.nombre, p.descripcion, p.precio, p.stock_minimo,
                    p.imagen, p.estado, c.nombre AS categoria_nombre,
                    COALESCE(SUM(i.stock_actual), 0) AS stock_actual,
                    (COALESCE(SUM(i.stock_actual), 0) < p.stock_minimo) AS bajo_stock
             FROM producto p
             INNER JOIN categoria c ON c.id_categoria = p.id_categoria
             LEFT JOIN inventario i ON i.id_producto = p.id_producto
             ${whereClause}
             GROUP BY p.id_producto, p.nombre, p.descripcion, p.precio, p.stock_minimo,
                      p.imagen, p.estado, c.nombre
             ${havingClause}
             ORDER BY bajo_stock DESC, p.nombre`,
            params
        );
        return rows;
    }

    static async findMovementById(id) {
        const [rows] = await pool.execute(
            `SELECT m.id_movimiento, m.id_producto, m.id_sucursal, m.id_usuario,
                    m.tipo, m.cantidad, m.stock_anterior, m.stock_resultante,
                    m.motivo, m.fecha_movimiento,
                    p.nombre AS producto,
                    s.nombre AS sucursal,
                    CONCAT(u.nombre, ' ', u.apellido) AS usuario
             FROM movimiento_inventario m
             INNER JOIN producto p ON p.id_producto = m.id_producto
             INNER JOIN sucursal s ON s.id_sucursal = m.id_sucursal
             INNER JOIN usuario u ON u.id_usuario = m.id_usuario
             WHERE m.id_movimiento = ?`,
            [id]
        );
        return rows[0];
    }

    static async findMovements(filters = {}) {
        const conditions = [];
        const params = [];

        if (filters.producto) {
            conditions.push('m.id_producto = ?');
            params.push(filters.producto);
        }

        if (filters.sucursal) {
            conditions.push('m.id_sucursal = ?');
            params.push(filters.sucursal);
        }

        if (filters.tipo) {
            conditions.push('m.tipo = ?');
            params.push(filters.tipo);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        const [rows] = await pool.execute(
            `SELECT m.id_movimiento, m.id_producto, m.id_sucursal, m.id_usuario,
                    m.tipo, m.cantidad, m.stock_anterior, m.stock_resultante,
                    m.motivo, m.fecha_movimiento,
                    p.nombre AS producto,
                    s.nombre AS sucursal,
                    CONCAT(u.nombre, ' ', u.apellido) AS usuario
             FROM movimiento_inventario m
             INNER JOIN producto p ON p.id_producto = m.id_producto
             INNER JOIN sucursal s ON s.id_sucursal = m.id_sucursal
             INNER JOIN usuario u ON u.id_usuario = m.id_usuario
             ${whereClause}
             ORDER BY m.fecha_movimiento DESC, m.id_movimiento DESC`,
            params
        );
        return rows;
    }

    static async findActiveBranchIds() {
        const [rows] = await pool.execute(
            'SELECT id_sucursal FROM sucursal WHERE estado = 1 ORDER BY id_sucursal ASC'
        );
        return rows.map((r) => r.id_sucursal);
    }

    static async findByProductForUpdate(connection, id_producto) {
        const [rows] = await connection.execute(
            `SELECT id_inventario, id_producto, id_sucursal, stock_actual
             FROM inventario
             WHERE id_producto = ?
             FOR UPDATE`,
            [id_producto]
        );
        return rows;
    }

    static async findInventoryForUpdate(connection, { id_producto, id_sucursal }) {
        const [rows] = await connection.execute(
            `SELECT id_inventario, id_producto, id_sucursal, stock_actual
             FROM inventario
             WHERE id_producto = ? AND id_sucursal = ?
             FOR UPDATE`,
            [id_producto, id_sucursal]
        );
        return rows[0];
    }

    static async createStock(connection, { id_producto, id_sucursal, stock_actual }) {
        const [result] = await connection.execute(
            `INSERT INTO inventario (id_producto, id_sucursal, stock_actual)
             VALUES (?, ?, ?)`,
            [id_producto, id_sucursal, stock_actual]
        );
        return result.insertId;
    }

    static async updateStock(connection, idInventario, stock_actual) {
        const [result] = await connection.execute(
            'UPDATE inventario SET stock_actual = ? WHERE id_inventario = ?',
            [stock_actual, idInventario]
        );
        return result.affectedRows;
    }

    static async findProduct(connection, id) {
        const [rows] = await connection.execute(
            'SELECT id_producto, nombre, estado FROM producto WHERE id_producto = ?',
            [id]
        );
        return rows[0];
    }

    static async createMovement(connection, { id_producto, id_sucursal, id_usuario, tipo, cantidad, stock_anterior, stock_resultante, motivo }) {
        const [result] = await connection.execute(
            `INSERT INTO movimiento_inventario
                 (id_producto, id_sucursal, id_usuario, tipo, cantidad,
                  stock_anterior, stock_resultante, motivo)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [id_producto, id_sucursal, id_usuario, tipo, cantidad, stock_anterior, stock_resultante, motivo || null]
        );
        return result.insertId;
    }
}

module.exports = Inventory;