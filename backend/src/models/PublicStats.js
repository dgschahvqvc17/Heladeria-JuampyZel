const supabase = require('../config/supabase');

async function countRows(tableName, column, filter) {
    let query = supabase.from(tableName).select(column, { count: 'exact', head: true });
    if (filter) {
        query = query.eq(filter[0], filter[1]);
    }
    const { count, error } = await query;
    if (error) throw error;
    return count;
}

class PublicStats {
    static async getStats() {
        const total_sabores = await countRows('producto', 'id_producto', ['estado', true]);
        const total_sucursales = await countRows('sucursal', 'id_sucursal', ['estado', true]);
        const total_clientes = await countRows('cliente', 'id_cliente', null);

        return { total_sabores, total_sucursales, total_clientes };
    }
}

module.exports = PublicStats;