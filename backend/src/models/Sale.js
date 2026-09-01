const supabase = require('../config/supabase');
const { unwrap } = require('../utils/unwrap');

const SALE_SELECT = 'id_venta, id_cliente, id_usuario, id_sucursal, fecha_venta, total, usuario, sucursal, cliente';

function mapSale(row) {
    return { ...row, total: Number(row.total) };
}

class Sale {
    static async findAll() {
        const rows = unwrap(
            await supabase
                .from('vista_ventas')
                .select(SALE_SELECT)
                .order('fecha_venta', { ascending: false })
                .order('id_venta', { ascending: false })
        );
        return rows.map(mapSale);
    }

    static async findByBranch(branchId) {
        const rows = unwrap(
            await supabase
                .from('vista_ventas')
                .select(SALE_SELECT)
                .eq('id_sucursal', branchId)
                .order('fecha_venta', { ascending: false })
                .order('id_venta', { ascending: false })
        );
        return rows.map(mapSale);
    }

    static async findById(id) {
        const sale = unwrap(
            await supabase
                .from('vista_ventas')
                .select(SALE_SELECT)
                .eq('id_venta', id)
                .maybeSingle()
        );
        if (!sale) return null;

        const details = unwrap(
            await supabase
                .from('detalle_venta')
                .select('id_detalle_venta, id_venta, id_producto, cantidad, precio_unitario, subtotal, producto(nombre)')
                .eq('id_venta', id)
                .order('id_detalle_venta')
        );

        sale.detalles = details.map(({ producto, ...detalle }) => ({
            ...detalle,
            producto: producto ? producto.nombre : null,
            cantidad: Number(detalle.cantidad),
            precio_unitario: Number(detalle.precio_unitario),
            subtotal: Number(detalle.subtotal)
        }));

        return mapSale(sale);
    }

    static async findActiveByBranch(branchId) {
        const products = unwrap(
            await supabase
                .from('vista_productos_activos')
                .select('id_producto, id_categoria, nombre, descripcion, precio, stock_minimo, imagen, categoria_nombre')
                .order('nombre')
        );

        const stocks = unwrap(
            await supabase
                .from('inventario')
                .select('id_producto, stock_actual')
                .eq('id_sucursal', branchId)
        );

        const stockByProduct = new Map(
            stocks.map((s) => [s.id_producto, Number(s.stock_actual)])
        );

        return products.map((p) => ({
            ...p,
            precio: Number(p.precio),
            stock_minimo: Number(p.stock_minimo),
            stock_actual: stockByProduct.get(p.id_producto) || 0
        }));
    }
}

module.exports = Sale;