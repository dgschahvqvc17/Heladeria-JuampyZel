const supabase = require('../config/supabase');
const { unwrap } = require('../utils/unwrap');

class Branch {
    static async attachResponsable(branches) {
        if (!branches.length) return branches;

        const ids = branches
            .map((b) => b.id_responsable)
            .filter((id) => id !== null && id !== undefined);

        const usersById = new Map();
        if (ids.length > 0) {
            const users = unwrap(
                await supabase
                    .from('usuario')
                    .select('id_usuario, nombre, apellido')
                    .in('id_usuario', ids)
            );
            users.forEach((u) => usersById.set(u.id_usuario, u));
        }

        return branches.map((b) => {
            const user = b.id_responsable != null ? usersById.get(b.id_responsable) : null;
            return {
                ...b,
                responsable: user ? `${user.nombre} ${user.apellido}` : null
            };
        });
    }

    static async findAll() {
        const rows = unwrap(
            await supabase
                .from('sucursal')
                .select('id_sucursal, nombre, direccion, telefono, id_responsable, estado')
                .order('id_sucursal', { ascending: false })
        );
        return Branch.attachResponsable(rows);
    }

    static async findById(id) {
        const row = unwrap(
            await supabase
                .from('sucursal')
                .select('id_sucursal, nombre, direccion, telefono, id_responsable, estado')
                .eq('id_sucursal', id)
                .maybeSingle()
        );
        if (!row) return null;
        return (await Branch.attachResponsable([row]))[0];
    }

    static async findByName(nombre) {
        return unwrap(
            await supabase
                .from('sucursal')
                .select('id_sucursal, nombre, direccion, telefono, id_responsable, estado')
                .eq('nombre', nombre)
                .maybeSingle()
        );
    }

    static async create({ nombre, direccion, telefono, id_responsable }) {
        const data = unwrap(
            await supabase
                .from('sucursal')
                .insert({
                    nombre,
                    direccion,
                    telefono: telefono || null,
                    id_responsable: id_responsable || null
                })
                .select('id_sucursal')
                .single()
        );
        return data.id_sucursal;
    }

    static async update(id, { nombre, direccion, telefono, id_responsable }) {
        const data = unwrap(
            await supabase
                .from('sucursal')
                .update({
                    nombre,
                    direccion,
                    telefono: telefono || null,
                    id_responsable: id_responsable || null
                })
                .eq('id_sucursal', id)
                .select('id_sucursal')
        );
        return data.length;
    }

    static async updateStatus(id, estado) {
        const data = unwrap(
            await supabase
                .from('sucursal')
                .update({ estado })
                .eq('id_sucursal', id)
                .select('id_sucursal')
        );
        return data.length;
    }

    static async findByResponsable(idResponsable) {
        return unwrap(
            await supabase
                .from('sucursal')
                .select('id_sucursal, id_responsable')
                .eq('id_responsable', idResponsable)
                .maybeSingle()
        );
    }
}

module.exports = Branch;