const pool = require('../config/database');
const Sale = require('../models/Sale');
const Branch = require('../models/Branch');
const Customer = require('../models/Customer');

class SaleService {
    static async getAll(branchId) {
        if (branchId) {
            return Sale.findByBranch(branchId);
        }
        return Sale.findAll();
    }

    static async getById(id) {
        const sale = await Sale.findById(id);
        if (!sale) throw new Error('Venta no encontrada.');
        return sale;
    }

    static async getProductsByBranch(branchId) {
        if (!branchId) throw new Error('Debe seleccionar una sucursal.');
        return Sale.findActiveByBranch(branchId);
    }

    static async create({ id_cliente, id_sucursal, detalles }, userId) {
        this.validateStructure({ id_sucursal, detalles });

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const branch = await Branch.findById(id_sucursal);
            if (!branch) throw new Error('La sucursal seleccionada no existe.');
            if (!branch.estado) throw new Error('La sucursal seleccionada está inactiva.');

            if (id_cliente) {
                const customer = await Customer.findById(id_cliente);
                if (!customer) throw new Error('El cliente seleccionado no existe.');
            }

            const items = await this.validateDetalles(connection, id_sucursal, detalles);

            const total = items.reduce(
                (sum, item) => sum + Number(item.subtotal),
                0
            );

            const saleId = await Sale.createVenta(connection, {
                id_cliente,
                id_usuario: userId,
                id_sucursal,
                total
            });

            for (const item of items) {
                await Sale.createDetalle(connection, {
                    id_venta: saleId,
                    id_producto: item.id_producto,
                    cantidad: item.cantidad,
                    precio_unitario: item.precio_unitario,
                    subtotal: item.subtotal
                });

                await Sale.decrementStock(connection, {
                    id_producto: item.id_producto,
                    id_sucursal,
                    cantidad: item.cantidad
                });
            }

            await connection.commit();
            return this.getById(saleId);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static validateStructure({ id_sucursal, detalles }) {
        if (!id_sucursal) {
            throw new Error('Debe seleccionar una sucursal.');
        }

        if (!Array.isArray(detalles) || detalles.length === 0) {
            throw new Error('Debe agregar al menos un producto a la venta.');
        }
    }

    static async validateDetalles(connection, idSucursal, detalles) {
        const uniqueProductIds = new Set(detalles.map((d) => d.id_producto));
        if (uniqueProductIds.size !== detalles.length) {
            throw new Error('No puede agregar el mismo producto más de una vez a la venta.');
        }

        const items = [];
        for (const detalle of detalles) {
            const { id_producto, cantidad } = detalle;

            if (!id_producto) {
                throw new Error('Debe seleccionar el producto de cada detalle.');
            }

            if (cantidad === undefined || cantidad === null || cantidad === '') {
                throw new Error('Debe indicar la cantidad de cada producto.');
            }

            const quantity = Number(cantidad);
            if (!Number.isInteger(quantity) || quantity <= 0) {
                throw new Error('La cantidad debe ser un número entero mayor a cero.');
            }

            const product = await Sale.findActiveProduct(connection, id_producto);
            if (!product) {
                throw new Error('Uno de los productos seleccionados no existe.');
            }
            if (!product.estado) {
                throw new Error(`El producto "${product.nombre}" está inactivo y no puede venderse.`);
            }

            const inventory = await Sale.findInventory(connection, {
                id_producto,
                id_sucursal: idSucursal
            });
            const stockActual = inventory ? inventory.stock_actual : 0;
            if (quantity > stockActual) {
                throw new Error(`Stock insuficiente para "${product.nombre}". Disponible: ${stockActual}.`);
            }

            const precioUnitario = Number(product.precio);
            const subtotal = precioUnitario * quantity;

            items.push({
                id_producto,
                cantidad: quantity,
                precio_unitario: precioUnitario,
                subtotal
            });
        }

        return items;
    }
}

module.exports = SaleService;
