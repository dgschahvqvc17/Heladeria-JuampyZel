const pool = require('../config/database');

class Alert {
    static async checkAndGenerateAlerts() {
        // Genera alertas para productos activos cuyo stock sea menor o igual al mínimo
        // y que NO tengan ya una alerta PENDIENTE.
        const query = `
            INSERT INTO alerta_stock (id_inventario)
            SELECT i.id_inventario
            FROM inventario i
            INNER JOIN producto p ON p.id_producto = i.id_producto
            WHERE i.stock_actual <= p.stock_minimo
              AND p.estado = 1
              AND NOT EXISTS (
                  SELECT 1 FROM alerta_stock a
                  WHERE a.id_inventario = i.id_inventario
                    AND a.estado = 'PENDIENTE'
              )
        `;
        const [result] = await pool.execute(query);
        return result.affectedRows;
    }

    static async findAll() {
        const query = `
            SELECT a.id_alerta, a.id_inventario, a.fecha_generacion, a.estado,
                   p.nombre AS producto, p.stock_minimo, i.stock_actual,
                   s.nombre AS sucursal
            FROM alerta_stock a
            INNER JOIN inventario i ON i.id_inventario = a.id_inventario
            INNER JOIN producto p ON p.id_producto = i.id_producto
            INNER JOIN sucursal s ON s.id_sucursal = i.id_sucursal
            ORDER BY a.estado DESC, a.fecha_generacion DESC
        `;
        const [rows] = await pool.execute(query);
        return rows;
    }

    static async findById(id) {
        const query = `
            SELECT a.id_alerta, a.id_inventario, a.fecha_generacion, a.estado,
                   p.nombre AS producto, p.stock_minimo, i.stock_actual,
                   s.nombre AS sucursal
            FROM alerta_stock a
            INNER JOIN inventario i ON i.id_inventario = a.id_inventario
            INNER JOIN producto p ON p.id_producto = i.id_producto
            INNER JOIN sucursal s ON s.id_sucursal = i.id_sucursal
            WHERE a.id_alerta = ?
        `;
        const [rows] = await pool.execute(query, [id]);
        return rows[0];
    }

    static async markAsAttended(id) {
        const [result] = await pool.execute(
            `UPDATE alerta_stock SET estado = 'ATENDIDA' WHERE id_alerta = ?`,
            [id]
        );
        return result.affectedRows;
    }
}

module.exports = Alert;