const pool = require('../config/database');
const Inventory = require('../models/Inventory');
const Branch = require('../models/Branch');

const MOVEMENT_TYPES = ['ENTRADA', 'SALIDA', 'AJUSTE'];

class InventoryService {
    static async getStock({ q } = {}) {
        const term = q && q.trim() ? q.trim() : null;
        return Inventory.findStock({ term });
    }

    static async getLowStock() {
        return Inventory.findStock({ lowStockOnly: true });
    }

    static async getMovements(filters = {}) {
        return Inventory.findMovements(filters);
    }

    static async getMovementById(id) {
        const movement = await Inventory.findMovementById(id);
        if (!movement) throw new Error('Movimiento de inventario no encontrado.');
        return movement;
    }

    static async registerMovement(data, userId) {
        this.validateMovementData(data);

        const { id_producto, id_sucursal, tipo } = data;
        const cantidad = Number(data.cantidad);
        const motivo = data.motivo ? String(data.motivo).trim() : null;

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const product = await Inventory.findProduct(connection, id_producto);
            if (!product) throw new Error('El producto seleccionado no existe.');

            const branch = await Branch.findById(id_sucursal);
            if (!branch) throw new Error('La sucursal seleccionada no existe.');
            if (!branch.estado) throw new Error('La sucursal seleccionada está inactiva.');

            const inventory = await Inventory.findInventoryForUpdate(connection, {
                id_producto,
                id_sucursal
            });

            const stockAnterior = inventory ? inventory.stock_actual : 0;
            let stockResultante;

            if (tipo === 'ENTRADA') {
                stockResultante = stockAnterior + cantidad;
            } else if (tipo === 'SALIDA') {
                if (cantidad > stockAnterior) {
                    throw new Error(`Stock insuficiente para "${product.nombre}". Disponible: ${stockAnterior}.`);
                }
                stockResultante = stockAnterior - cantidad;
            } else {
                stockResultante = cantidad;
            }

            if (inventory) {
                await Inventory.updateStock(connection, inventory.id_inventario, stockResultante);
            } else {
                await Inventory.createStock(connection, {
                    id_producto,
                    id_sucursal,
                    stock_actual: stockResultante
                });
            }

            const movementId = await Inventory.createMovement(connection, {
                id_producto,
                id_sucursal,
                id_usuario: userId,
                tipo,
                cantidad: tipo === 'SALIDA' ? -cantidad : cantidad,
                stock_anterior: stockAnterior,
                stock_resultante: stockResultante,
                motivo
            });

            await connection.commit();
            return this.getMovementById(movementId);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static validateMovementData({ id_producto, id_sucursal, tipo, cantidad, motivo }) {
        if (!id_producto) {
            throw new Error('Debe seleccionar el producto del movimiento.');
        }

        if (!id_sucursal) {
            throw new Error('Debe seleccionar la sucursal del movimiento.');
        }

        if (!tipo || !MOVEMENT_TYPES.includes(tipo)) {
            throw new Error('El tipo de movimiento no es válido.');
        }

        if (cantidad === undefined || cantidad === null || cantidad === '') {
            throw new Error('Debe indicar la cantidad del movimiento.');
        }

        const quantity = Number(cantidad);
        if (!Number.isInteger(quantity) || quantity <= 0) {
            throw new Error('La cantidad debe ser un número entero mayor a cero.');
        }

        if (tipo === 'AJUSTE') {
            const reason = motivo ? String(motivo).trim() : '';
            if (!reason) {
                throw new Error('Debe indicar el motivo del ajuste.');
            }
            if (reason.length < 2) {
                throw new Error('El motivo del ajuste debe tener al menos 2 caracteres.');
            }
        }
    }
}

module.exports = InventoryService;