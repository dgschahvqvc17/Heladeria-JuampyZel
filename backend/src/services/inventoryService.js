const pool = require('../config/database');
const Inventory = require('../models/Inventory');
const Branch = require('../models/Branch');
const Product = require('../models/Product');

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

    static async adjustTotalStock({ id_producto, nuevo_stock, motivo }, userId) {
        this.validateAdjustData({ id_producto, nuevo_stock, motivo });

        const nuevoStock = Number(nuevo_stock);

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const product = await Inventory.findProduct(connection, id_producto);
            if (!product) throw new Error('El producto seleccionado no existe.');

            const inventories = await Inventory.findByProductForUpdate(connection, id_producto);
            const currentTotal = inventories.reduce((sum, inv) => sum + inv.stock_actual, 0);

            if (inventories.length === 0) {
                const branchIds = await Inventory.findActiveBranchIds();
                if (branchIds.length === 0) {
                    throw new Error('No hay sucursales activas para asignar el stock.');
                }
                const idSucursal = branchIds[0];
                await Inventory.createStock(connection, {
                    id_producto,
                    id_sucursal: idSucursal,
                    stock_actual: nuevoStock
                });
                await Inventory.createMovement(connection, {
                    id_producto,
                    id_sucursal: idSucursal,
                    id_usuario: userId,
                    tipo: 'AJUSTE',
                    cantidad: nuevoStock,
                    stock_anterior: 0,
                    stock_resultante: nuevoStock,
                    motivo
                });
            } else {
                if (nuevoStock === currentTotal) {
                    await connection.commit();
                    return { stock_actual: currentTotal, distribuido: false };
                }
                const targets = this.distributeStock(nuevoStock, inventories.map((inv) => inv.stock_actual));
                for (let i = 0; i < inventories.length; i++) {
                    const inv = inventories[i];
                    const target = targets[i];
                    if (target === inv.stock_actual) continue;
                    const diff = target - inv.stock_actual;
                    await Inventory.updateStock(connection, inv.id_inventario, target);
                    await Inventory.createMovement(connection, {
                        id_producto,
                        id_sucursal: inv.id_sucursal,
                        id_usuario: userId,
                        tipo: 'AJUSTE',
                        cantidad: diff,
                        stock_anterior: inv.stock_actual,
                        stock_resultante: target,
                        motivo
                    });
                }
            }

            await connection.commit();
            return { stock_actual: nuevoStock, distribuido: true };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static validateAdjustData({ id_producto, nuevo_stock, motivo }) {
        if (!id_producto) {
            throw new Error('Debe seleccionar el producto.');
        }

        if (nuevo_stock === undefined || nuevo_stock === null || nuevo_stock === '') {
            throw new Error('Debe indicar el nuevo stock del producto.');
        }

        const value = Number(nuevo_stock);
        if (!Number.isInteger(value) || value < 0) {
            throw new Error('El stock debe ser un número entero mayor o igual a cero.');
        }

        const reason = motivo ? String(motivo).trim() : '';
        if (!reason) {
            throw new Error('Debe indicar el motivo del ajuste.');
        }
        if (reason.length < 2) {
            throw new Error('El motivo del ajuste debe tener al menos 2 caracteres.');
        }
    }

    static distributeStock(total, weights) {
        const n = weights.length;
        if (n === 0) return [];
        if (total <= 0) return weights.map(() => 0);

        const sumWeights = weights.reduce((a, b) => a + b, 0);
        if (sumWeights <= 0) {
            const base = Math.floor(total / n);
            let remainder = total - base * n;
            const result = new Array(n).fill(base);
            for (let i = 0; i < n && remainder > 0; i++, remainder--) {
                result[i] += 1;
            }
            return result;
        }

        const base = [];
        let assigned = 0;
        for (let i = 0; i < n; i++) {
            const value = Math.floor((weights[i] * total) / sumWeights);
            base.push(value);
            assigned += value;
        }
        let remainder = total - assigned;
        let idx = 0;
        while (remainder > 0) {
            base[idx % n] += 1;
            remainder -= 1;
            idx += 1;
        }
        return base;
    }

    static async updateStockMinimo({ id_producto, stock_minimo }) {
        this.validateStockMinimo({ id_producto, stock_minimo });
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const product = await Inventory.findProduct(connection, id_producto);
            if (!product) throw new Error('El producto seleccionado no existe.');
            await Product.updateStockMinimo(id_producto, Number(stock_minimo));
            await connection.commit();
            return { id_producto, stock_minimo: Number(stock_minimo) };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static validateStockMinimo({ id_producto, stock_minimo }) {
        if (!id_producto) {
            throw new Error('Debe seleccionar el producto.');
        }
        if (stock_minimo === undefined || stock_minimo === null || stock_minimo === '') {
            throw new Error('Debe indicar el stock mínimo del producto.');
        }
        const value = Number(stock_minimo);
        if (!Number.isInteger(value) || value < 0) {
            throw new Error('El stock mínimo debe ser un número entero mayor o igual a cero.');
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