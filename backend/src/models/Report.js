const pool = require('../config/database');

function buildDateFilter(dateFrom, dateTo, column) {
    const conditions = [];
    const params = [];

    if (dateFrom) {
        conditions.push(`${column} >= ?`);
        params.push(`${dateFrom} 00:00:00`);
    }

    if (dateTo) {
        conditions.push(`${column} <= ?`);
        params.push(`${dateTo} 23:59:59`);
    }

    return { conditions, params };
}

class Report {
    static async getSales({ dateFrom, dateTo, branchId }) {
        const dateFilter = buildDateFilter(dateFrom, dateTo, 'v.fecha_venta');
        const conditionals = [...dateFilter.conditions];
        const params = [...dateFilter.params];

        if (branchId) {
            conditionals.push('v.id_sucursal = ?');
            params.push(branchId);
        }

        const whereClause = conditionals.length > 0 ? `WHERE ${conditionals.join(' AND ')}` : '';

        const [rows] = await pool.execute(
            `SELECT v.id_venta, v.fecha_venta, v.total,
                    CONCAT(u.nombre, ' ', u.apellido) AS usuario,
                    s.nombre AS sucursal,
                    CONCAT(c.nombres, ' ', c.apellidos) AS cliente
             FROM venta v
             INNER JOIN usuario u ON u.id_usuario = v.id_usuario
             INNER JOIN sucursal s ON s.id_sucursal = v.id_sucursal
             LEFT JOIN cliente c ON c.id_cliente = v.id_cliente
             ${whereClause}
             ORDER BY v.fecha_venta DESC, v.id_venta DESC`,
            params
        );
        return rows;
    }

    static async getSalesSummary({ dateFrom, dateTo, branchId }) {
        const dateFilter = buildDateFilter(dateFrom, dateTo, 'v.fecha_venta');
        const conditionals = [...dateFilter.conditions];
        const params = [...dateFilter.params];

        if (branchId) {
            conditionals.push('v.id_sucursal = ?');
            params.push(branchId);
        }

        const whereClause = conditionals.length > 0 ? `WHERE ${conditionals.join(' AND ')}` : '';

        const [totals] = await pool.execute(
            `SELECT COUNT(*) AS total_ventas,
                    COALESCE(SUM(v.total), 0) AS total_ingresos
             FROM venta v
             ${whereClause}`,
            params
        );

        const [byBranch] = await pool.execute(
            `SELECT s.nombre AS name, COUNT(*) AS value
             FROM venta v
             INNER JOIN sucursal s ON s.id_sucursal = v.id_sucursal
             ${whereClause}
             GROUP BY s.id_sucursal, s.nombre
             ORDER BY value DESC`,
            params
        );

        const [byProduct] = await pool.execute(
            `SELECT p.nombre AS name, SUM(dv.cantidad) AS value
             FROM detalle_venta dv
             INNER JOIN venta v ON v.id_venta = dv.id_venta
             INNER JOIN producto p ON p.id_producto = dv.id_producto
             ${whereClause}
             GROUP BY p.id_producto, p.nombre
             ORDER BY value DESC
             LIMIT 10`,
            params
        );

        const [byDay] = await pool.execute(
            `SELECT DATE(v.fecha_venta) AS date, COALESCE(SUM(v.total), 0) AS total
             FROM venta v
             ${whereClause}
             GROUP BY DATE(v.fecha_venta)
             ORDER BY date`,
            params
        );

        return {
            totals: totals[0]
                ? {
                    total_ventas: Number(totals[0].total_ventas),
                    total_ingresos: Number(totals[0].total_ingresos)
                  }
                : { total_ventas: 0, total_ingresos: 0 },
            byBranch: byBranch.map((r) => ({ name: r.name, value: Number(r.value) })),
            byProduct: byProduct.map((r) => ({ name: r.name, value: Number(r.value) })),
            byDay: byDay.map((r) => ({ date: r.date, total: Number(r.total) }))
        };
    }

    static async getOrders({ dateFrom, dateTo, estado }) {
        const dateFilter = buildDateFilter(dateFrom, dateTo, 'o.fecha_pedido');
        const conditionals = [...dateFilter.conditions];
        const params = [...dateFilter.params];

        if (estado) {
            conditionals.push('o.estado = ?');
            params.push(estado);
        }

        const whereClause = conditionals.length > 0 ? `WHERE ${conditionals.join(' AND ')}` : '';

        const [rows] = await pool.execute(
            `SELECT o.id_pedido, o.fecha_pedido, o.estado, o.total,
                    t.nombre AS tienda
             FROM pedido o
             INNER JOIN tienda t ON t.id_tienda = o.id_tienda
             ${whereClause}
             ORDER BY o.fecha_pedido DESC, o.id_pedido DESC`,
            params
        );
        return rows;
    }

    static async getOrdersSummary({ dateFrom, dateTo, estado }) {
        const dateFilter = buildDateFilter(dateFrom, dateTo, 'o.fecha_pedido');
        const conditionals = [...dateFilter.conditions];
        const params = [...dateFilter.params];

        if (estado) {
            conditionals.push('o.estado = ?');
            params.push(estado);
        }

        const whereClause = conditionals.length > 0 ? `WHERE ${conditionals.join(' AND ')}` : '';

        const [totals] = await pool.execute(
            `SELECT COUNT(*) AS total_pedidos,
                    COALESCE(SUM(o.total), 0) AS total_pedidos_monto
             FROM pedido o
             ${whereClause}`,
            params
        );

        const [byEstado] = await pool.execute(
            `SELECT o.estado AS name, COUNT(*) AS value
             FROM pedido o
             ${whereClause}
             GROUP BY o.estado
             ORDER BY value DESC`,
            params
        );

        const [byTienda] = await pool.execute(
            `SELECT t.nombre AS name, COUNT(*) AS value
             FROM pedido o
             INNER JOIN tienda t ON t.id_tienda = o.id_tienda
             ${whereClause}
             GROUP BY t.id_tienda, t.nombre
             ORDER BY value DESC
             LIMIT 10`,
            params
        );

        return {
            totals: totals[0]
                ? {
                    total_pedidos: Number(totals[0].total_pedidos),
                    total_pedidos_monto: Number(totals[0].total_pedidos_monto)
                  }
                : { total_pedidos: 0, total_pedidos_monto: 0 },
            byEstado: byEstado.map((r) => ({ name: r.name, value: Number(r.value) })),
            byTienda: byTienda.map((r) => ({ name: r.name, value: Number(r.value) }))
        };
    }

    static async getProducts() {
        const [rows] = await pool.execute(
            `SELECT p.id_producto, p.nombre, p.descripcion, p.precio,
                    p.stock_minimo, p.estado, c.nombre AS categoria,
                    COALESCE(SUM(i.stock_actual), 0) AS stock_total,
                    (COALESCE(SUM(i.stock_actual), 0) < p.stock_minimo) AS bajo_stock
             FROM producto p
             INNER JOIN categoria c ON c.id_categoria = p.id_categoria
             LEFT JOIN inventario i ON i.id_producto = p.id_producto
             GROUP BY p.id_producto, p.nombre, p.descripcion, p.precio,
                      p.stock_minimo, p.estado, c.nombre
             ORDER BY p.nombre`
        );
        return rows;
    }

    static async getProductsSummary() {
        const [totals] = await pool.execute(
            `SELECT COUNT(*) AS total_productos,
                    SUM(p.estado = 1) AS productos_activos,
                    SUM(p.estado = 0) AS productos_inactivos
             FROM producto p`
        );

        const [byCategory] = await pool.execute(
            `SELECT c.nombre AS name, COUNT(p.id_producto) AS value
             FROM categoria c
             LEFT JOIN producto p ON p.id_categoria = c.id_categoria
             GROUP BY c.id_categoria, c.nombre
             ORDER BY value DESC`
        );

        const [lowStock] = await pool.execute(
            `SELECT p.id_producto, p.nombre, p.precio, p.stock_minimo,
                    COALESCE(SUM(i.stock_actual), 0) AS stock_total
             FROM producto p
             LEFT JOIN inventario i ON i.id_producto = p.id_producto
             WHERE p.estado = 1
             GROUP BY p.id_producto, p.nombre, p.precio, p.stock_minimo
             HAVING COALESCE(SUM(i.stock_actual), 0) < p.stock_minimo
             ORDER BY stock_total ASC, p.nombre`
        );

        return {
            totals: totals[0]
                ? {
                    total_productos: Number(totals[0].total_productos),
                    productos_activos: Number(totals[0].productos_activos),
                    productos_inactivos: Number(totals[0].productos_inactivos)
                  }
                : { total_productos: 0, productos_activos: 0, productos_inactivos: 0 },
            byCategory: byCategory.map((r) => ({ name: r.name, value: Number(r.value) })),
            lowStock: lowStock.map((r) => ({
                id_producto: r.id_producto,
                nombre: r.nombre,
                precio: r.precio,
                stock_minimo: r.stock_minimo,
                stock_total: Number(r.stock_total)
            }))
        };
    }

    static async getInventory({ dateFrom, dateTo }) {
        const dateFilter = buildDateFilter(dateFrom, dateTo, 'm.fecha_movimiento');
        const whereClause = dateFilter.conditions.length > 0
            ? `WHERE ${dateFilter.conditions.join(' AND ')}`
            : '';

        const [rows] = await pool.execute(
            `SELECT m.id_movimiento, m.fecha_movimiento, m.tipo, m.cantidad,
                    m.stock_anterior, m.stock_resultante, m.motivo,
                    p.nombre AS producto,
                    s.nombre AS sucursal,
                    CONCAT(u.nombre, ' ', u.apellido) AS usuario
             FROM movimiento_inventario m
             INNER JOIN producto p ON p.id_producto = m.id_producto
             INNER JOIN sucursal s ON s.id_sucursal = m.id_sucursal
             INNER JOIN usuario u ON u.id_usuario = m.id_usuario
             ${whereClause}
             ORDER BY m.fecha_movimiento DESC, m.id_movimiento DESC`,
            dateFilter.params
        );
        return rows;
    }

    static async getInventorySummary({ dateFrom, dateTo }) {
        const dateFilter = buildDateFilter(dateFrom, dateTo, 'm.fecha_movimiento');
        const whereClause = dateFilter.conditions.length > 0
            ? `WHERE ${dateFilter.conditions.join(' AND ')}`
            : '';

        const [movements] = await pool.execute(
            `SELECT COUNT(*) AS total_movimientos,
                    COALESCE(SUM(m.tipo = 'ENTRADA'), 0) AS entradas,
                    COALESCE(SUM(m.tipo = 'SALIDA'), 0) AS salidas,
                    COALESCE(SUM(m.tipo = 'AJUSTE'), 0) AS ajustes
             FROM movimiento_inventario m
             ${whereClause}`,
            dateFilter.params
        );

        const [byTipo] = await pool.execute(
            `SELECT m.tipo AS name, COUNT(*) AS value
             FROM movimiento_inventario m
             ${whereClause}
             GROUP BY m.tipo
             ORDER BY value DESC`,
            dateFilter.params
        );

        const [stock] = await pool.execute(
            `SELECT COUNT(DISTINCT p.id_producto) AS productos_con_stock,
                    COALESCE(SUM(i.stock_actual), 0) AS unidades_totales
             FROM producto p
             LEFT JOIN inventario i ON i.id_producto = p.id_producto
             WHERE p.estado = 1`
        );

        return {
            totals: movements[0]
                ? {
                    total_movimientos: Number(movements[0].total_movimientos),
                    entradas: Number(movements[0].entradas),
                    salidas: Number(movements[0].salidas),
                    ajustes: Number(movements[0].ajustes)
                  }
                : { total_movimientos: 0, entradas: 0, salidas: 0, ajustes: 0 },
            byTipo: byTipo.map((r) => ({ name: r.name, value: Number(r.value) })),
            stock: stock[0]
                ? {
                    productos_con_stock: Number(stock[0].productos_con_stock),
                    unidades_totales: Number(stock[0].unidades_totales)
                  }
                : { productos_con_stock: 0, unidades_totales: 0 }
        };
    }

    static async getDashboard() {
        const [sales] = await pool.execute(
            `SELECT COUNT(*) AS total_ventas,
                    COALESCE(SUM(total), 0) AS total_ingresos
             FROM venta`
        );

        const [orders] = await pool.execute(
            `SELECT COUNT(*) AS total_pedidos,
                    COALESCE(SUM(total), 0) AS total_pedidos_monto
             FROM pedido`
        );

        const [products] = await pool.execute(
            `SELECT COUNT(*) AS total_productos,
                    COALESCE(SUM(
                        (SELECT COALESCE(SUM(i.stock_actual), 0)
                         FROM inventario i WHERE i.id_producto = p.id_producto) < p.stock_minimo
                    ), 0) AS total_bajo_stock
             FROM producto p
             WHERE p.estado = 1`
        );

        const [inventory] = await pool.execute(
            `SELECT COALESCE(SUM(stock_actual), 0) AS unidades_totales
             FROM inventario`
        );

        const [branches] = await pool.execute(
            `SELECT COUNT(*) AS total_sucursales FROM sucursal WHERE estado = 1`
        );

        const [customers] = await pool.execute(`SELECT COUNT(*) AS total_clientes FROM cliente`);
        const [stores] = await pool.execute(`SELECT COUNT(*) AS total_tiendas FROM tienda WHERE estado = 1`);

        const [salesByBranch] = await pool.execute(
            `SELECT s.nombre AS name, COUNT(*) AS value
             FROM venta v
             INNER JOIN sucursal s ON s.id_sucursal = v.id_sucursal
             GROUP BY s.id_sucursal, s.nombre
             ORDER BY value DESC`
        );

        const [ordersByEstado] = await pool.execute(
            `SELECT estado AS name, COUNT(*) AS value
             FROM pedido
             GROUP BY estado
             ORDER BY value DESC`
        );

        const [productsByCategory] = await pool.execute(
            `SELECT c.nombre AS name, COUNT(p.id_producto) AS value
             FROM categoria c
             LEFT JOIN producto p ON p.id_categoria = c.id_categoria AND p.estado = 1
             GROUP BY c.id_categoria, c.nombre
             ORDER BY value DESC`
        );

        const [stockMinimo] = await pool.execute(
            `SELECT p.nombre AS name, COALESCE(SUM(i.stock_actual), 0) AS value, p.stock_minimo
             FROM producto p
             LEFT JOIN inventario i ON i.id_producto = p.id_producto
             WHERE p.estado = 1
             GROUP BY p.id_producto, p.nombre, p.stock_minimo
             HAVING COALESCE(SUM(i.stock_actual), 0) < p.stock_minimo
             ORDER BY value ASC
             LIMIT 5`
        );

        return {
            kpis: {
                total_ventas: Number(sales[0].total_ventas),
                total_ingresos: Number(sales[0].total_ingresos),
                total_pedidos: Number(orders[0].total_pedidos),
                total_pedidos_monto: Number(orders[0].total_pedidos_monto),
                total_productos: Number(products[0].total_productos),
                total_bajo_stock: Number(products[0].total_bajo_stock),
                unidades_totales: Number(inventory[0].unidades_totales),
                total_sucursales: Number(branches[0].total_sucursales),
                total_clientes: Number(customers[0].total_clientes),
                total_tiendas: Number(stores[0].total_tiendas)
            },
            charts: {
                salesByBranch: salesByBranch.map((r) => ({ name: r.name, value: Number(r.value) })),
                ordersByEstado: ordersByEstado.map((r) => ({ name: r.name, value: Number(r.value) })),
                productsByCategory: productsByCategory.map((r) => ({ name: r.name, value: Number(r.value) })),
                lowStock: stockMinimo.map((r) => ({
                    name: r.name,
                    value: Number(r.value),
                    stock_minimo: r.stock_minimo
                }))
            }
        };
    }
}

module.exports = Report;
