const supabase = require('../config/supabase');
const { unwrap } = require('../utils/unwrap');

class Customer {
    static async findAll() {
        return unwrap(
            await supabase
                .from('cliente')
                .select('id_cliente, nombres, apellidos, telefono, correo, direccion, fecha_registro')
                .order('id_cliente', { ascending: false })
        );
    }

    static async findById(id) {
        return unwrap(
            await supabase
                .from('cliente')
                .select('id_cliente, nombres, apellidos, telefono, correo, direccion, fecha_registro')
                .eq('id_cliente', id)
                .maybeSingle()
        );
    }

    static async findByEmail(correo) {
        return unwrap(
            await supabase
                .from('cliente')
                .select('id_cliente, correo')
                .eq('correo', correo)
                .maybeSingle()
        );
    }

    static async search(term) {
        const like = `%${term}%`;
        return unwrap(
            await supabase
                .from('cliente')
                .select('id_cliente, nombres, apellidos, telefono, correo, direccion, fecha_registro')
                .or(`nombres.ilike.${like},apellidos.ilike.${like},correo.ilike.${like},telefono.ilike.${like}`)
                .order('id_cliente', { ascending: false })
        );
    }

    static async create({ nombres, apellidos, telefono, correo, direccion }) {
        const data = unwrap(
            await supabase
                .from('cliente')
                .insert({
                    nombres,
                    apellidos,
                    telefono: telefono || null,
                    correo: correo ? correo.toLowerCase() : null,
                    direccion: direccion || null
                })
                .select('id_cliente')
                .single()
        );
        return data.id_cliente;
    }

    static async update(id, { nombres, apellidos, telefono, correo, direccion }) {
        const data = unwrap(
            await supabase
                .from('cliente')
                .update({
                    nombres,
                    apellidos,
                    telefono: telefono || null,
                    correo: correo ? correo.toLowerCase() : null,
                    direccion: direccion || null
                })
                .eq('id_cliente', id)
                .select('id_cliente')
        );
        return data.length;
    }
}

module.exports = Customer;