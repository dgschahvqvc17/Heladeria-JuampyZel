const supabase = require('../config/supabase');
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

        const product = await Product.findById(id_producto);
        if (!product) throw new Error('El producto seleccionado no existe.');

        const branch = await Branch.findById(id_sucursal);
        if (!branch) throw new Error('La sucursal seleccionada no existe.');
        if (!branch.estado) throw new Error('La sucursal seleccionada está inactiva.');

        // Actualiza stock y registra el movimiento de forma atomica.
        const { data: movementId, error } = await supabase.rpc('registrar_movimiento_inventario', {
            p_id_producto: id_producto,
            p_id_sucursal,
            p_id_usuario: userId,
            p_tipo: tipo,
            p_cantidad: cantidad,
            p_motivo: motivo
        });
        if (error) throw error;

        return this.getMovementById(Number(movementId));
    }

    static async adjustTotalStock({ id_producto, nuevo_stock, motivo }, userId) {
        this.validateAdjustData({ id_producto, nuevo_stock, motivo });

        const nuevoStock = Number(nuevo_stock);
        const reason = motivo ? String(motivo).trim() : null;

        const product = await Product.findById(id_producto);
        if (!product) throw new Error('El producto seleccionado no existe.');

        const { data: inventories, error: listError } = await supabase
            .from('inventario')
            .select('id_inventario, id_sucursal, stock_actual')
            .eq('id_producto', id_producto)
            .order('id_sucursal');
        if (listError) throw listError;

        const inventoriesNumbered = inventories.map((inv) => ({
            ...inv,
            stock_actual: Number(inv.stock_actual)
        }));

        let distribucion = [];

        if (inventoriesNumbered.length === 0) {
            const branchIds = await Inventory.findActiveBranchIds();
            if (branchIds.length === 0) {
                throw new Error('No hay sucursales activas para asignar el stock.');
            }
            distribucion.push({
                id_inventario: null,
                id_sucursal: branchIds[0],
                stock_anterior: 0,
                nuevo_stock: nuevoStock,
                cantidad: nuevoStock
            });
        } else {
            const currentTotal = inventoriesNumbered.reduce(
                (sum, inv) => sum + inv.stock_actual,
                0
            );

            if (nuevoStock === currentTotal) {
                return { stock_actual: currentTotal, distribuido: false };
            }

            const targets = this.distributeStock(
                nuevoStock,
                inventoriesNumbered.map((inv) => inv.stock_actual)
            );

            inventoriesNumbered.forEach((inv, i) => {
                const target = targets[i];
                if (target === inv.stock_actual) return;
                distribucion.push({
                    id_inventario: inv.id_inventario,
                    id_sucursal: inv.id_sucursal,
                    stock_anterior: inv.stock_actual,
                    nuevo_stock: target,
                    cantidad: target - inv.stock_actual
                });
            });
        }

        // Aplica todos los cambios de stock y sus movimientos de forma atomica.
        const { error } = await supabase.rpc('ajustar_stock_total', {
            p_id_producto: id_producto,
            p_id_usuario: userId,
            p_motivo: reason,
            p_distribucion: distribucion
        });
        if (error) throw error;

        return { stock_actual: nuevoStock, distribuido: true };
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

        const product = await Product.findById(id_producto);
        if (!product) throw new Error('El producto seleccionado no existe.');

        await Product.updateStockMinimo(id_producto, Number(stock_minimo));
        return { id_producto, stock_minimo: Number(stock_minimo) };
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