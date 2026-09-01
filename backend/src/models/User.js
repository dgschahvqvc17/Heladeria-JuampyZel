const supabase = require('../config/supabase');
const { unwrap } = require('../utils/unwrap');

class User {
    static async findAll() {
        return unwrap(
            await supabase
                .from('usuario')
                .select('id_usuario, nombre, apellido, correo, rol, estado, fecha_registro')
                .order('fecha_registro', { ascending: false })
        );
    }

    static async findById(id) {
        return unwrap(
            await supabase
                .from('usuario')
                .select('id_usuario, nombre, apellido, correo, rol, estado, fecha_registro')
                .eq('id_usuario', id)
                .maybeSingle()
        );
    }

    static async findByEmail(correo) {
        return unwrap(
            await supabase
                .from('usuario')
                .select('id_usuario, nombre, apellido, correo, password, rol, estado, fecha_registro')
                .ilike('correo', correo)
                .maybeSingle()
        );
    }

    static async findByIdWithPassword(id) {
        return unwrap(
            await supabase
                .from('usuario')
                .select('id_usuario, nombre, apellido, correo, password, rol, estado')
                .eq('id_usuario', id)
                .maybeSingle()
        );
    }

    static async create({ nombre, apellido, correo, password, rol }) {
        const data = unwrap(
            await supabase
                .from('usuario')
                .insert({ nombre, apellido, correo, password, rol })
                .select('id_usuario')
                .single()
        );
        return data.id_usuario;
    }

    static async update(id, { nombre, apellido, correo, rol }) {
        const data = unwrap(
            await supabase
                .from('usuario')
                .update({ nombre, apellido, correo, rol })
                .eq('id_usuario', id)
                .select('id_usuario')
        );
        return data.length;
    }

    static async updatePassword(id, password) {
        const data = unwrap(
            await supabase
                .from('usuario')
                .update({ password })
                .eq('id_usuario', id)
                .select('id_usuario')
        );
        return data.length;
    }

    static async updateStatus(id, estado) {
        const data = unwrap(
            await supabase
                .from('usuario')
                .update({ estado })
                .eq('id_usuario', id)
                .select('id_usuario')
        );
        return data.length;
    }

    static async findManagersAvailableForBranch() {
        const managers = unwrap(
            await supabase
                .from('usuario')
                .select('id_usuario, nombre, apellido, correo, estado')
                .eq('rol', 'ENCARGADO_SUCURSAL')
                .order('nombre')
                .order('apellido')
        );

        if (managers.length === 0) return managers;

        const ids = managers.map((m) => m.id_usuario);
        const branches = unwrap(
            await supabase
                .from('sucursal')
                .select('id_sucursal, nombre, id_responsable')
                .in('id_responsable', ids)
        );

        const branchByResponsable = new Map(
            branches.map((b) => [b.id_responsable, b])
        );

        return managers.map((m) => {
            const branch = branchByResponsable.get(m.id_usuario);
            return {
                ...m,
                sucursal_asignada: branch ? branch.id_sucursal : null,
                sucursal_nombre: branch ? branch.nombre : null
            };
        });
    }
}

module.exports = User;