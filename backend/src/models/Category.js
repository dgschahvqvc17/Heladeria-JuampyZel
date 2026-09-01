const supabase = require('../config/supabase');
const { unwrap } = require('../utils/unwrap');

class Category {
    static async findAll() {
        const rows = unwrap(
            await supabase
                .from('categoria')
                .select('id_categoria, nombre, descripcion, estado, producto(id_categoria)')
                .order('nombre')
        );
        return rows.map(({ producto, ...categoria }) => ({
            ...categoria,
            cantidad_productos: Array.isArray(producto) ? producto.length : 0
        }));
    }

    static async findActiveAll() {
        return unwrap(
            await supabase
                .from('categoria')
                .select('id_categoria, nombre')
                .eq('estado', true)
                .order('nombre')
        );
    }

    static async findById(id) {
        return unwrap(
            await supabase
                .from('categoria')
                .select('id_categoria, nombre, descripcion, estado')
                .eq('id_categoria', id)
                .maybeSingle()
        );
    }

    static async findByName(nombre) {
        return unwrap(
            await supabase
                .from('categoria')
                .select('id_categoria, nombre')
                .eq('nombre', nombre)
                .maybeSingle()
        );
    }

    static async create({ nombre, descripcion }) {
        const data = unwrap(
            await supabase
                .from('categoria')
                .insert({ nombre, descripcion: descripcion || null })
                .select('id_categoria')
                .single()
        );
        return data.id_categoria;
    }

    static async update(id, { nombre, descripcion }) {
        const data = unwrap(
            await supabase
                .from('categoria')
                .update({ nombre, descripcion: descripcion || null })
                .eq('id_categoria', id)
                .select('id_categoria')
        );
        return data.length;
    }

    static async updateStatus(id, estado) {
        const data = unwrap(
            await supabase
                .from('categoria')
                .update({ estado })
                .eq('id_categoria', id)
                .select('id_categoria')
        );
        return data.length;
    }
}

module.exports = Category;