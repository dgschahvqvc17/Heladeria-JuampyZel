const supabase = require('../config/supabase');
const { unwrap } = require('../utils/unwrap');

class Report {
    static async getSales({ dateFrom, dateTo, branchId }) {
        let query = supabase
            .from('vista_ventas')
            .select('id_venta, fecha_venta, total, usuario, sucursal, cliente');

        if (dateFrom) {
            query = query.gte('fecha_venta', `${dateFrom} 00:00:00`);
        }
        if (dateTo) {
            query = query.lte('fecha_venta', `${dateTo} 23:59:59`);
        }
        if (branchId) {
            query = query.eq('id_sucursal', branchId);
        }

        const rows = unwrap(
            await query
                .order('fecha_venta', { ascending: false })
                .order('id_venta', { ascending: false })
        );
        return rows.map((r) => ({ ...r, total: Number(r.total) }));
    }

    static async getSalesSummary({ dateFrom, dateTo, branchId }) {
        const { data, error } = await supabase.rpc('reporte_ventas_resumen', {
            p_fecha_desde: dateFrom || null,
            p_fecha_hasta: dateTo || null,
            p_id_sucursal: branchId || null
        });
        if (error) throw error;

        return {
            totals: data.totals || { total_ventas: 0, total_ingresos: 0 },
            byBranch: data.byBranch || [],
            byProduct: data.byProduct || [],
            byDay: data.byDay || []
        };
    }

    static async getOrders({ dateFrom, dateTo, estado }) {
        let query = supabase
            .from('vista_pedidos')
            .select('id_pedido, fecha_pedido, estado, total, tienda');

        if (dateFrom) {
            query = query.gte('fecha_pedido', `${dateFrom} 00:00:00`);
        }
        if (dateTo) {
            query = query.lte('fecha_pedido', `${dateTo} 23:59:59`);
        }
        if (estado) {
            query = query.eq('estado', estado);
        }

        const rows = unwrap(
            await query
                .order('fecha_pedido', { ascending: false })
                .order('id_pedido', { ascending: false })
        );
        return rows.map((r) => ({ ...r, total: Number(r.total) }));
    }

    static async getOrdersSummary({ dateFrom, dateTo, estado }) {
        const { data, error } = await supabase.rpc('reporte_pedidos_resumen', {
            p_fecha_desde: dateFrom || null,
            p_fecha_hasta: dateTo || null,
            p_estado: estado || null
        });
        if (error) throw error;

        return {
            totals: data.totals || { total_pedidos: 0, total_pedidos_monto: 0 },
            byEstado: data.byEstado || [],
            byTienda: data.byTienda || []
        };
    }

    static async getProducts() {
        const rows = unwrap(
            await supabase
                .from('vista_stock_producto')
                .select('id_producto, nombre, descripcion, precio, stock_minimo, estado, categoria_nombre, stock_actual, bajo_stock')
                .order('nombre')
        );
        return rows.map((r) => ({
            id_producto: r.id_producto,
            nombre: r.nombre,
            descripcion: r.descripcion,
            precio: Number(r.precio),
            stock_minimo: Number(r.stock_minimo),
            estado: r.estado,
            categoria: r.categoria_nombre,
            stock_total: Number(r.stock_actual),
            bajo_stock: r.bajo_stock
        }));
    }

    static async getProductsSummary() {
        const { data, error } = await supabase.rpc('reporte_productos_resumen');
        if (error) throw error;

        return {
            totals: data.totals || {
                total_productos: 0,
                productos_activos: 0,
                productos_inactivos: 0
            },
            byCategory: data.byCategory || [],
            lowStock: data.lowStock || []
        };
    }

    static async getInventory({ dateFrom, dateTo }) {
        let query = supabase
            .from('vista_movimientos')
            .select('id_movimiento, fecha_movimiento, tipo, cantidad, stock_anterior, stock_resultante, motivo, producto, sucursal, usuario');

        if (dateFrom) {
            query = query.gte('fecha_movimiento', `${dateFrom} 00:00:00`);
        }
        if (dateTo) {
            query = query.lte('fecha_movimiento', `${dateTo} 23:59:59`);
        }

        return unwrap(
            await query
                .order('fecha_movimiento', { ascending: false })
                .order('id_movimiento', { ascending: false })
        );
    }

    static async getInventorySummary({ dateFrom, dateTo }) {
        const { data, error } = await supabase.rpc('reporte_inventario_resumen', {
            p_fecha_desde: dateFrom || null,
            p_fecha_hasta: dateTo || null
        });
        if (error) throw error;

        return {
            totals: data.totals || {
                total_movimientos: 0,
                entradas: 0,
                salidas: 0,
                ajustes: 0
            },
            byTipo: data.byTipo || [],
            stock: data.stock || { productos_con_stock: 0, unidades_totales: 0 }
        };
    }

    static async getDashboard() {
        const { data, error } = await supabase.rpc('reporte_dashboard');
        if (error) throw error;

        return {
            kpis: data.kpis || {
                total_ventas: 0,
                total_ingresos: 0,
                total_pedidos: 0,
                total_pedidos_monto: 0,
                total_productos: 0,
                total_bajo_stock: 0,
                unidades_totales: 0,
                total_sucursales: 0,
                total_clientes: 0,
                total_tiendas: 0
            },
            charts: {
                salesByBranch: (data.charts && data.charts.salesByBranch) || [],
                ordersByEstado: (data.charts && data.charts.ordersByEstado) || [],
                productsByCategory: (data.charts && data.charts.productsByCategory) || [],
                lowStock: (data.charts && data.charts.lowStock) || []
            }
        };
    }
}

module.exports = Report;