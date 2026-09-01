const supabase = require('../config/supabase');
const Order = require('../models/Order');
const Store = require('../models/Store');

const VALID_STATES = ['PENDIENTE', 'CONFIRMADO', 'PREPARANDO', 'LISTO', 'ENTREGADO', 'CANCELADO'];

class OrderService {
    static async getAll(requester) {
        if (requester.rol === 'TIENDA') {
            const store = await this.getStoreForUser(requester.id_usuario);
            return Order.findStoreOrders(store.id_tienda);
        }
        return Order.findAll();
    }

    static async getById(id, requester) {
        let order;
        if (requester.rol === 'TIENDA') {
            const store = await this.getStoreForUser(requester.id_usuario);
            order = await Order.findByStoreAndId(store.id_tienda, id);
        } else {
            order = await Order.findById(id);
        }

        if (!order) throw new Error('Pedido no encontrado.');
        return order;
    }

    static async getCatalog() {
        return Order.getCatalog();
    }

    static async create({ detalles }, userId) {
        const store = await this.getStoreForUser(userId);
        this.validateStructure(detalles);

        const items = await this.validateDetalles(detalles);
        const total = items.reduce((sum, item) => sum + Number(item.subtotal), 0);

        // La transacción (pedido + detalle + historial PENDIENTE) se ejecuta
        // de forma atomica en la base de datos mediante el RPC registrar_pedido.
        const { data, error } = await supabase.rpc('registrar_pedido', {
            p_id_tienda: store.id_tienda,
            p_id_usuario: userId,
            p_total: total,
            p_detalles: items
        });
        if (error) throw error;

        return this.getById(Number(data), { rol: 'TIENDA', id_usuario: userId });
    }

    static async updateStatus(id, estado_nuevo, requester) {
        if (requester.rol === 'TIENDA') {
            throw new Error('La tienda no puede modificar el estado de su pedido.');
        }

        if (!estado_nuevo || !VALID_STATES.includes(estado_nuevo)) {
            throw new Error('El estado del pedido no es válido.');
        }

        const existing = await Order.findById(id);
        if (!existing) throw new Error('Pedido no encontrado.');

        if (existing.estado === estado_nuevo) {
            throw new Error('El pedido ya se encuentra en este estado.');
        }

        // Actualiza el estado y registra el historial de forma atomica.
        const { error } = await supabase.rpc('actualizar_estado_pedido', {
            p_id_pedido: id,
            p_id_usuario: requester.id_usuario,
            p_estado_anterior: existing.estado,
            p_estado_nuevo: estado_nuevo
        });
        if (error) throw error;

        return this.getById(id, requester);
    }

    static async getStoreForUser(userId) {
        const store = await Store.findByUserId(userId);
        if (!store) throw new Error('No se encontró una tienda vinculada a esta cuenta.');
        if (!store.estado) throw new Error('La tienda vinculada a esta cuenta está desactivada.');
        return store;
    }

    static validateStructure(detalles) {
        if (!Array.isArray(detalles) || detalles.length === 0) {
            throw new Error('Debe agregar al menos un producto al pedido.');
        }
    }

    static async validateDetalles(detalles) {
        const uniqueProductIds = new Set(detalles.map((d) => d.id_producto));
        if (uniqueProductIds.size !== detalles.length) {
            throw new Error('No puede agregar el mismo producto más de una vez al pedido.');
        }

        const items = [];
        for (const detalle of detalles) {
            const { id_producto, cantidad } = detalle;
            if (!id_producto) throw new Error('Debe seleccionar el producto de cada detalle.');
            if (cantidad === undefined || cantidad === null || cantidad === '') throw new Error('Debe indicar la cantidad de cada producto.');

            const quantity = Number(cantidad);
            if (!Number.isInteger(quantity) || quantity <= 0) throw new Error('La cantidad debe ser un número entero mayor a cero.');

            const { data: product, error: productError } = await supabase
                .from('producto')
                .select('id_producto, nombre, precio, estado')
                .eq('id_producto', id_producto)
                .maybeSingle();
            if (productError) throw productError;

            if (!product) throw new Error('Uno de los productos seleccionados no existe.');
            if (!product.estado) throw new Error(`El producto "${product.nombre}" está inactivo y no puede solicitarse.`);

            const { data: stocks, error: stocksError } = await supabase
                .from('inventario')
                .select('stock_actual')
                .eq('id_producto', id_producto);
            if (stocksError) throw stocksError;

            const stockDisponible = stocks.reduce(
                (sum, s) => sum + Number(s.stock_actual),
                0
            );
            if (quantity > stockDisponible) throw new Error(`Disponibilidad insuficiente para "${product.nombre}". Disponible: ${stockDisponible}.`);

            const precioUnitario = Number(product.precio);
            items.push({
                id_producto,
                cantidad: quantity,
                precio_unitario: precioUnitario,
                subtotal: precioUnitario * quantity
            });
        }
        return items;
    }
}

module.exports = OrderService;