const pool = require('../config/database');

class Sale {
    static async findAll() {
        const [rows] = await pool.execute(
            `SELECT v.id_venta, v.id_cliente, v.id_usuario, v.id_sucursal,
                    v.fecha_venta, v.total,
                    CONCAT(u.nombre, ' ', u.apellido) AS usuario,
                    s.nombre AS sucursal,
                    CONCAT(c.nombres, ' ', c.apellidos) AS cliente
             FROM venta v
             INNER JOIN usuario u ON u.id_usuario = v.id_usuario
             INNER JOIN sucursal s ON s.id_sucursal = v.id_sucursal
             LEFT JOIN cliente c ON c.id_cliente = v.id_cliente
             ORDER BY v.fecha_venta DESC, v.id_venta DESC`
        );
        return rows;
    }

    static async findByBranch(branchId) {
        const [rows] = await pool.execute(
            `SELECT v.id_venta, v.id_cliente, v.id_usuario, v.id_sucursal,
                    v.fecha_venta, v.total,
                    CONCAT(u.nombre, ' ', u.apellido) AS usuario,
                    s.nombre AS sucursal,
                    CONCAT(c.nombres, ' ', c.apellidos) AS cliente
             FROM venta v
             INNER JOIN usuario u ON u.id_usuario = v.id_usuario
             INNER JOIN sucursal s ON s.id_sucursal = v.id_sucursal
             LEFT JOIN cliente c ON c.id_cliente = v.id_cliente
             WHERE v.id_sucursal = ?
             ORDER BY v.fecha_venta DESC, v.id_venta DESC`,
            [branchId]
        );
        return rows;
    }

    static async findById(id) {
        const [saleRows] = await pool.execute(
            `SELECT v.id_venta, v.id_cliente, v.id_usuario, v.id_sucursal,
                    v.fecha_venta, v.total,
                    CONCAT(u.nombre, ' ', u.apellido) AS usuario,
                    s.nombre AS sucursal,
                    CONCAT(c.nombres, ' ', c.apellidos) AS cliente
             FROM venta v
             INNER JOIN usuario u ON u.id_usuario = v.id_usuario
             INNER JOIN sucursal s ON s.id_sucursal = v.id_sucursal
             LEFT JOIN cliente c ON c.id_cliente = v.id_cliente
             WHERE v.id_venta = ?`,
            [id]
        );
        const sale = saleRows[0];
        if (!sale) return null;

        const [details] = await pool.execute(
            `SELECT dv.id_detalle_venta, dv.id_venta, dv.id_producto, dv.cantidad,
                    dv.precio_unitario, dv.subtotal, p.nombre AS producto
             FROM detalle_venta dv
             INNER JOIN producto p ON p.id_producto = dv.id_producto
             WHERE dv.id_venta = ?
             ORDER BY dv.id_detalle_venta`,
            [id]
        );
        sale.detalles = details;

        return sale;
    }

    static async findActiveByBranch(branchId) {
        const [rows] = await pool.execute(
            `SELECT p.id_producto, p.id_categoria, p.nombre, p.descripcion, p.precio,
                    p.stock_minimo, p.imagen, c.nombre AS categoria_nombre,
                    COALESCE(i.stock_actual, 0) AS stock_actual
             FROM producto p
             INNER JOIN categoria c ON c.id_categoria = p.id_categoria
             LEFT JOIN inventario i
                    ON i.id_producto = p.id_producto AND i.id_sucursal = ?
             WHERE p.estado = 1 AND c.estado = 1
             ORDER BY p.nombre`,
            [branchId]
        );
        return rows;
    }

    static async findActiveProduct(connection, id) {
        const [rows] = await connection.execute(
            'SELECT id_producto, nombre, precio, estado FROM producto WHERE id_producto = ?',
            [id]
        );
        return rows[0];
    }

    static async findInventory(connection, { id_producto, id_sucursal }) {
        const [rows] = await connection.execute(
            `SELECT id_inventario, id_producto, id_sucursal, stock_actual
             FROM inventario
             WHERE id_producto = ? AND id_sucursal = ?
             FOR UPDATE`,
            [id_producto, id_sucursal]
        );
        return rows[0];
    }

    static async createVenta(connection, { id_cliente, id_usuario, id_sucursal, total }) {
        const [result] = await connection.execute(
            'INSERT INTO venta (id_cliente, id_usuario, id_sucursal, total) VALUES (?, ?, ?, ?)',
            [id_cliente || null, id_usuario, id_sucursal, total]
        );
        return result.insertId;
    }

    static async createDetalle(connection, { id_venta, id_producto, cantidad, precio_unitario, subtotal }) {
        const [result] = await connection.execute(
            `INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal)
             VALUES (?, ?, ?, ?, ?)`,
            [id_venta, id_producto, cantidad, precio_unitario, subtotal]
        );
        return result.insertId;
    }

    static async decrementStock(connection, { id_producto, id_sucursal, cantidad }) {
        const [result] = await connection.execute(
            `UPDATE inventario
             SET stock_actual = stock_actual - ?
             WHERE id_producto = ? AND id_sucursal = ?`,
            [cantidad, id_producto, id_sucursal]
        );
        return result.affectedRows;
    }
}

module.exports = Sale;
