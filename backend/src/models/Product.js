const supabase = require('../config/supabase');
const { unwrap } = require('../utils/unwrap');

function mapProduct(row) {
    return {
        ...row,
        precio: Number(row.precio),
        stock_minimo: Number(row.stock_minimo)
    };
}

class Product {
    static async findAll() {
        const rows = unwrap(
            await supabase
                .from('vista_productos')
                .select('id_producto, id_categoria, nombre, descripcion, precio, stock_minimo, imagen, estado, categoria_nombre')
                .order('nombre')
        );
        return rows.map(mapProduct);
    }

    static async findActiveAll() {
        const rows = unwrap(
            await supabase
                .from('vista_productos_activos')
                .select('id_producto, id_categoria, nombre, descripcion, precio, stock_minimo, imagen, categoria_nombre')
                .order('nombre')
        );
        return rows.map(mapProduct);
    }

    static async findById(id) {
        const row = unwrap(
            await supabase
                .from('vista_productos')
                .select('id_producto, id_categoria, nombre, descripcion, precio, stock_minimo, imagen, estado, categoria_nombre')
                .eq('id_producto', id)
                .maybeSingle()
        );
        return row ? mapProduct(row) : null;
    }

    static async search(term) {
        const like = `%${term}%`;
        const rows = unwrap(
            await supabase
                .from('vista_productos')
                .select('id_producto, id_categoria, nombre, descripcion, precio, stock_minimo, imagen, estado, categoria_nombre')
                .or(`nombre.ilike.${like},descripcion.ilike.${like},categoria_nombre.ilike.${like}`)
                .order('nombre')
        );
        return rows.map(mapProduct);
    }

    static async create({ id_categoria, nombre, descripcion, precio, stock_minimo, imagen, estado }) {
        const data = unwrap(
            await supabase
                .from('producto')
                .insert({
                    id_categoria,
                    nombre,
                    descripcion: descripcion || null,
                    precio,
                    stock_minimo,
                    imagen: imagen || null,
                    estado
                })
                .select('id_producto')
                .single()
        );
        return data.id_producto;
    }

    static async update(id, { id_categoria, nombre, descripcion, precio, stock_minimo, imagen, estado }) {
        const data = unwrap(
            await supabase
                .from('producto')
                .update({
                    id_categoria,
                    nombre,
                    descripcion: descripcion || null,
                    precio,
                    stock_minimo,
                    imagen: imagen || null,
                    estado
                })
                .eq('id_producto', id)
                .select('id_producto')
        );
        return data.length;
    }

    static async updateStatus(id, estado) {
        const data = unwrap(
            await supabase
                .from('producto')
                .update({ estado })
                .eq('id_producto', id)
                .select('id_producto')
        );
        return data.length;
    }

    static async updateStockMinimo(id, stock_minimo) {
        const data = unwrap(
            await supabase
                .from('producto')
                .update({ stock_minimo })
                .eq('id_producto', id)
                .select('id_producto')
        );
        return data.length;
    }
}

module.exports = Product;