const pool = require('../config/database');

class Order {
    static async findAll() {
        const [rows] = await pool.execute(
            `SELECT o.id_pedido, o.id_tienda, o.id_usuario, o.fecha_pedido,
                    o.estado, o.total, t.nombre AS tienda
             FROM pedido o
             INNER JOIN tienda t ON t.id_tienda = o.id_tienda
             ORDER BY o.fecha_pedido DESC, o.id_pedido DESC`
        );
        return rows;
    }

    static async findStoreOrders(storeId) {
        const [rows] = await pool.execute(
            `SELECT o.id_pedido, o.id_tienda, o.id_usuario, o.fecha_pedido,
                    o.estado, o.total, t.nombre AS tienda
             FROM pedido o
             INNER JOIN tienda t ON t.id_tienda = o.id_tienda
             WHERE o.id_tienda = ?
             ORDER BY o.fecha_pedido DESC, o.id_pedido DESC`,
            [storeId]
        );
        return rows;
    }

    static async findById(id) {
        const [orderRows] = await pool.execute(
            `SELECT o.id_pedido, o.id_tienda, o.id_usuario, o.fecha_pedido,
                    o.estado, o.total, t.nombre AS tienda
             FROM pedido o
             INNER JOIN tienda t ON t.id_tienda = o.id_tienda
             WHERE o.id_pedido = ?`,
            [id]
        );
        const order = orderRows[0];
        if (!order) return null;

        const [details] = await pool.execute(
            `SELECT dv.id_detalle_pedido, dv.id_pedido, dv.id_producto, dv.cantidad,
                    dv.precio_unitario, dv.subtotal, p.nombre AS producto
             FROM detalle_pedido dv
             INNER JOIN producto p ON p.id_producto = dv.id_producto
             WHERE dv.id_pedido = ?
             ORDER BY dv.id_detalle_pedido`,
            [id]
        );
        order.detalles = details;

        const [history] = await pool.execute(
            `SELECT h.id_historial, h.estado_anterior, h.estado_nuevo, h.fecha_cambio,
                    CONCAT(u.nombre, ' ', u.apellido) AS usuario
             FROM historial_pedido h
             INNER JOIN usuario u ON u.id_usuario = h.id_usuario
             WHERE h.id_pedido = ?
             ORDER BY h.fecha_cambio ASC`,
            [id]
        );
        order.historial = history;

        return order;
    }

    static async findByStoreAndId(storeId, id) {
        const [rows] = await pool.execute(
            `SELECT o.id_pedido, o.id_tienda, o.id_usuario, o.fecha_pedido,
                    o.estado, o.total, t.nombre AS tienda
             FROM pedido o
             INNER JOIN tienda t ON t.id_tienda = o.id_tienda
             WHERE o.id_tienda = ? AND o.id_pedido = ?`,
            [storeId, id]
        );
        const order = rows[0];
        if (!order) return null;

        const [details] = await pool.execute(
            `SELECT dv.id_detalle_pedido, dv.id_pedido, dv.id_producto, dv.cantidad,
                    dv.precio_unitario, dv.subtotal, p.nombre AS producto
             FROM detalle_pedido dv
             INNER JOIN producto p ON p.id_producto = dv.id_producto
             WHERE dv.id_pedido = ?
             ORDER BY dv.id_detalle_pedido`,
            [id]
        );
        order.detalles = details;

        const [history] = await pool.execute(
            `SELECT h.id_historial, h.estado_anterior, h.estado_nuevo, h.fecha_cambio,
                    CONCAT(u.nombre, ' ', u.apellido) AS usuario
             FROM historial_pedido h
             INNER JOIN usuario u ON u.id_usuario = h.id_usuario
             WHERE h.id_pedido = ?
             ORDER BY h.fecha_cambio ASC`,
            [id]
        );
        order.historial = history;

        return order;
    }

    static async getCatalog() {
        const [rows] = await pool.execute(
            `SELECT p.id_producto, p.id_categoria, p.nombre, p.descripcion, p.precio,
                    p.stock_minimo, p.imagen, c.nombre AS categoria_nombre,
                    COALESCE(SUM(i.stock_actual), 0) AS stock_disponible
             FROM producto p
             INNER JOIN categoria c ON c.id_categoria = p.id_categoria
             LEFT JOIN inventario i ON i.id_producto = p.id_producto
             WHERE p.estado = 1 AND c.estado = 1
             GROUP BY p.id_producto, p.id_categoria, p.nombre, p.descripcion,
                      p.precio, p.stock_minimo, p.imagen, c.nombre
             ORDER BY p.nombre`
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

    static async findInventorySum(connection, id) {
        const [rows] = await connection.execute(
            'SELECT COALESCE(SUM(stock_actual), 0) AS stock FROM inventario WHERE id_producto = ?',
            [id]
        );
        return rows[0] ? Number(rows[0].stock) : 0;
    }

    static async createPedido(connection, { id_tienda, id_usuario, total }) {
        const [result] = await connection.execute(
            'INSERT INTO pedido (id_tienda, id_usuario, total) VALUES (?, ?, ?)',
            [id_tienda, id_usuario, total]
        );
        return result.insertId;
    }

    static async createDetalle(connection, { id_pedido, id_producto, cantidad, precio_unitario, subtotal }) {
        const [result] = await connection.execute(
            `INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario, subtotal)
             VALUES (?, ?, ?, ?, ?)`,
            [id_pedido, id_producto, cantidad, precio_unitario, subtotal]
        );
        return result.insertId;
    }

    // Actualizado para grabar el historial dentro de la transacción
    static async updateStatusWithHistory(connection, { id_pedido, id_usuario, estado_anterior, estado_nuevo }) {
        await connection.execute(
            'UPDATE pedido SET estado = ? WHERE id_pedido = ?',
            [estado_nuevo, id_pedido]
        );

        await connection.execute(
            `INSERT INTO historial_pedido (id_pedido, id_usuario, estado_anterior, estado_nuevo) 
             VALUES (?, ?, ?, ?)`,
            [id_pedido, id_usuario, estado_anterior, estado_nuevo]
        );
    }
}

module.exports = Order;