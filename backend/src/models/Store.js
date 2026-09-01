const supabase = require('../config/supabase');
const { unwrap } = require('../utils/unwrap');

class Store {
    static async findAll() {
        return unwrap(
            await supabase
                .from('tienda')
                .select('id_tienda, id_usuario, nombre, responsable, telefono, correo, direccion, estado, fecha_registro')
                .order('id_tienda', { ascending: false })
        );
    }

    static async findById(id) {
        return unwrap(
            await supabase
                .from('tienda')
                .select('id_tienda, id_usuario, nombre, responsable, telefono, correo, direccion, estado, fecha_registro')
                .eq('id_tienda', id)
                .maybeSingle()
        );
    }

    static async findByUserId(userId) {
        return unwrap(
            await supabase
                .from('tienda')
                .select('id_tienda, id_usuario, nombre, responsable, telefono, correo, direccion, estado, fecha_registro')
                .eq('id_usuario', userId)
                .maybeSingle()
        );
    }

    static async findByName(nombre) {
        return unwrap(
            await supabase
                .from('tienda')
                .select('id_tienda, nombre')
                .eq('nombre', nombre)
                .maybeSingle()
        );
    }

    static async create({ id_usuario, nombre, responsable, telefono, correo, direccion }) {
        const data = unwrap(
            await supabase
                .from('tienda')
                .insert({
                    id_usuario,
                    nombre,
                    responsable,
                    telefono: telefono || null,
                    correo: correo || null,
                    direccion
                })
                .select('id_tienda')
                .single()
        );
        return data.id_tienda;
    }

    static async update(id, { nombre, responsable, telefono, correo, direccion }) {
        const data = unwrap(
            await supabase
                .from('tienda')
                .update({
                    nombre,
                    responsable,
                    telefono: telefono || null,
                    correo: correo || null,
                    direccion
                })
                .eq('id_tienda', id)
                .select('id_tienda')
        );
        return data.length;
    }

    static async updateStatus(id, estado) {
        const data = unwrap(
            await supabase
                .from('tienda')
                .update({ estado })
                .eq('id_tienda', id)
                .select('id_tienda')
        );
        return data.length;
    }
}

module.exports = Store;