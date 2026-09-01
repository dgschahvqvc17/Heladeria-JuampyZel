const supabase = require('../config/supabase');
const { unwrap } = require('../utils/unwrap');

const ALERT_SELECT = 'id_alerta, id_inventario, fecha_generacion, estado, producto, stock_minimo, stock_actual, sucursal';

function mapAlert(row) {
    return {
        ...row,
        stock_minimo: Number(row.stock_minimo),
        stock_actual: Number(row.stock_actual)
    };
}

class Alert {
    static async checkAndGenerateAlerts() {
        const { data, error } = await supabase.rpc('generar_alertas_stock');
        if (error) throw error;
        return Number(data);
    }

    static async findAll() {
        const rows = unwrap(
            await supabase
                .from('vista_alertas')
                .select(ALERT_SELECT)
                .order('estado_orden', { ascending: true })
                .order('fecha_generacion', { ascending: false })
        );
        return rows.map(mapAlert);
    }

    static async findById(id) {
        const row = unwrap(
            await supabase
                .from('vista_alertas')
                .select(ALERT_SELECT)
                .eq('id_alerta', id)
                .maybeSingle()
        );
        return row ? mapAlert(row) : null;
    }

    static async markAsAttended(id) {
        const data = unwrap(
            await supabase
                .from('alerta_stock')
                .update({ estado: 'ATENDIDA' })
                .eq('id_alerta', id)
                .select('id_alerta')
        );
        return data.length;
    }
}

module.exports = Alert;