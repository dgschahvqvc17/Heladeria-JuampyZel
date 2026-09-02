const supabase = require('../config/supabase');
const { unwrap } = require('../utils/unwrap');

const ORDER_SELECT = 'id_pedido, id_tienda, id_usuario, fecha_pedido, estado, total, tienda';

class Order {
    static async findAll() {
        const rows = unwrap(
            await supabase
                .from('vista_pedidos')
                .select(ORDER_SELECT)
                .order('fecha_pedido', { ascending: false })
                .order('id_pedido', { ascending: false })
        );
        return rows.map((o) => ({ ...o, total: Number(o.total) }));
    }

    static async findStoreOrders(storeId) {
        const rows = unwrap(
            await supabase
                .from('vista_pedidos')
                .select(ORDER_SELECT)
                .eq('id_tienda', storeId)
                .order('fecha_pedido', { ascending: false })
                .order('id_pedido', { ascending: false })
        );
        return rows.map((o) => ({ ...o, total: Number(o.total) }));
    }

    static async attachDetailsAndHistory(order, id) {
        const details = unwrap(
            await supabase
                .from('detalle_pedido')
                .select('id_detalle_pedido, id_pedido, id_producto, cantidad, precio_unitario, subtotal, producto(nombre)')
                .eq('id_pedido', id)
                .order('id_detalle_pedido')
        );

        order.detalles = details.map(({ producto, ...detalle }) => ({
            ...detalle,
            producto: producto ? producto.nombre : null,
            cantidad: Number(detalle.cantidad),
            precio_unitario: Number(detalle.precio_unitario),
            subtotal: Number(detalle.subtotal)
        }));

        order.historial = unwrap(
            await supabase
                .from('vista_historial_pedido')
                .select('id_historial, estado_anterior, estado_nuevo, fecha_cambio, usuario')
                .eq('id_pedido', id)
                .order('fecha_cambio', { ascending: true })
        );

        return order;
    }

    static async findById(id) {
        const order = unwrap(
            await supabase
                .from('vista_pedidos')
                .select(ORDER_SELECT)
                .eq('id_pedido', id)
                .maybeSingle()
        );
        if (!order) return null;

        order.total = Number(order.total);
        return Order.attachDetailsAndHistory(order, id);
    }

    static async findByStoreAndId(storeId, id) {
        const order = unwrap(
            await supabase
                .from('vista_pedidos')
                .select(ORDER_SELECT)
                .eq('id_tienda', storeId)
                .eq('id_pedido', id)
                .maybeSingle()
        );
        if (!order) return null;

        order.total = Number(order.total);
        return Order.attachDetailsAndHistory(order, id);
    }

    static async getCatalog() {
        const rows = unwrap(
            await supabase
                .from('vista_catalogo_productos')
                .select('id_producto, id_categoria, nombre, descripcion, precio, stock_minimo, imagen, categoria_nombre, stock_disponible')
                .order('nombre')
        );
        return rows.map((p) => ({
            ...p,
            precio: Number(p.precio),
            stock_minimo: Number(p.stock_minimo),
            stock_disponible: Number(p.stock_disponible)
        }));
    }

    static async findStoreNotifications(storeId) {
        const pedidos = unwrap(
            await supabase
                .from('pedido')
                .select('id_pedido, historial_pedido(id_historial, estado_anterior, estado_nuevo, fecha_cambio)')
                .eq('id_tienda', storeId)
        );

        const notifications = [];
        for (const pedido of pedidos) {
            for (const h of pedido.historial_pedido || []) {
                notifications.push({
                    id_notificacion: h.id_historial,
                    id_pedido: pedido.id_pedido,
                    estado_anterior: h.estado_anterior,
                    estado_nuevo: h.estado_nuevo,
                    fecha_cambio: h.fecha_cambio
                });
            }
        }

        notifications.sort((a, b) => new Date(b.fecha_cambio) - new Date(a.fecha_cambio));
        return notifications;
    }
}

module.exports = Order;