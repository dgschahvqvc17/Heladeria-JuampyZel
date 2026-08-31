const pool = require('../config/database');
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

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const items = await this.validateDetalles(connection, detalles);
            const total = items.reduce((sum, item) => sum + Number(item.subtotal), 0);

            const orderId = await Order.createPedido(connection, {
                id_tienda: store.id_tienda,
                id_usuario: userId,
                total
            });

            for (const item of items) {
                await Order.createDetalle(connection, {
                    id_pedido: orderId,
                    id_producto: item.id_producto,
                    cantidad: item.cantidad,
                    precio_unitario: item.precio_unitario,
                    subtotal: item.subtotal
                });
            }

            // Grabar el estado inicial PENDIENTE en el historial
            await Order.updateStatusWithHistory(connection, {
                id_pedido: orderId,
                id_usuario: userId,
                estado_anterior: 'NUEVO',
                estado_nuevo: 'PENDIENTE'
            });

            await connection.commit();
            return this.getById(orderId, { rol: 'TIENDA', id_usuario: userId });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
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

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            
            await Order.updateStatusWithHistory(connection, {
                id_pedido: id,
                id_usuario: requester.id_usuario,
                estado_anterior: existing.estado,
                estado_nuevo: estado_nuevo
            });

            await connection.commit();
            return this.getById(id, requester);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
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

    static async validateDetalles(connection, detalles) {
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

            const product = await Order.findActiveProduct(connection, id_producto);
            if (!product) throw new Error('Uno de los productos seleccionados no existe.');
            if (!product.estado) throw new Error(`El producto "${product.nombre}" está inactivo y no puede solicitarse.`);

            const stockDisponible = await Order.findInventorySum(connection, id_producto);
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