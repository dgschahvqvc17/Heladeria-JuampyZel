const supabase = require('../config/supabase');
const { unwrap } = require('../utils/unwrap');

const MOVEMENT_SELECT = 'id_movimiento, id_producto, id_sucursal, id_usuario, tipo, cantidad, stock_anterior, stock_resultante, motivo, fecha_movimiento, producto, sucursal, usuario';

function mapMovement(row) {
    return {
        ...row,
        cantidad: Number(row.cantidad),
        stock_anterior: Number(row.stock_anterior),
        stock_resultante: Number(row.stock_resultante)
    };
}

class Inventory {
    static async findStock({ term, lowStockOnly } = {}) {
        let query = supabase
            .from('vista_stock_producto')
            .select('id_producto, id_categoria, nombre, descripcion, precio, stock_minimo, imagen, estado, categoria_nombre, stock_actual, bajo_stock');

        if (term) {
            const like = `%${term}%`;
            query = query.or(`nombre.ilike.${like},descripcion.ilike.${like},categoria_nombre.ilike.${like}`);
        }

        if (lowStockOnly) {
            query = query.eq('bajo_stock', true);
        }

        const rows = unwrap(await query);

        return rows
            .map((r) => ({
                ...r,
                precio: Number(r.precio),
                stock_minimo: Number(r.stock_minimo),
                stock_actual: Number(r.stock_actual)
            }))
            .sort((a, b) => {
                if (a.bajo_stock !== b.bajo_stock) return a.bajo_stock ? -1 : 1;
                return a.nombre.localeCompare(b.nombre);
            });
    }

    static async findMovementById(id) {
        const row = unwrap(
            await supabase
                .from('vista_movimientos')
                .select(MOVEMENT_SELECT)
                .eq('id_movimiento', id)
                .maybeSingle()
        );
        return row ? mapMovement(row) : null;
    }

    static async findMovements(filters = {}) {
        let query = supabase
            .from('vista_movimientos')
            .select(MOVEMENT_SELECT);

        if (filters.producto) {
            query = query.eq('id_producto', filters.producto);
        }

        if (filters.sucursal) {
            query = query.eq('id_sucursal', filters.sucursal);
        }

        if (filters.tipo) {
            query = query.eq('tipo', filters.tipo);
        }

        const rows = unwrap(
            await query
                .order('fecha_movimiento', { ascending: false })
                .order('id_movimiento', { ascending: false })
        );
        return rows.map(mapMovement);
    }

    static async findActiveBranchIds() {
        const rows = unwrap(
            await supabase
                .from('sucursal')
                .select('id_sucursal')
                .eq('estado', true)
                .order('id_sucursal')
        );
        return rows.map((r) => r.id_sucursal);
    }
}

module.exports = Inventory;