const Branch = require('../models/Branch');

class BranchService {
    static async getAll() {
        return Branch.findAll();
    }

    static async getById(id) {
        const branch = await Branch.findById(id);
        if (!branch) throw new Error('Sucursal no encontrada.');
        return branch;
    }

    static async create({ nombre, direccion, telefono, responsable }) {
        this.validateFields({ nombre, direccion });

        const existingBranch = await Branch.findByName(nombre.trim());
        if (existingBranch) {
            throw new Error('El nombre de la sucursal ya está registrado.');
        }

        const branchId = await Branch.create({
            nombre: nombre.trim(),
            direccion: direccion.trim(),
            telefono: telefono ? telefono.trim() : null,
            responsable: responsable ? responsable.trim() : null
        });

        return this.getById(branchId);
    }

    static async update(id, { nombre, direccion, telefono, responsable }) {
        this.validateFields({ nombre, direccion });

        const existingBranch = await Branch.findById(id);
        if (!existingBranch) throw new Error('Sucursal no encontrada.');

        const duplicateName = await Branch.findByName(nombre.trim());
        if (duplicateName && duplicateName.id_sucursal !== parseInt(id)) {
            throw new Error('El nombre ya está registrado por otra sucursal.');
        }

        await Branch.update(id, {
            nombre: nombre.trim(),
            direccion: direccion.trim(),
            telefono: telefono ? telefono.trim() : null,
            responsable: responsable ? responsable.trim() : null
        });

        return this.getById(id);
    }

    static async toggleStatus(id) {
        const branch = await Branch.findById(id);
        if (!branch) throw new Error('Sucursal no encontrada.');

        await Branch.updateStatus(id, !branch.estado);
        return this.getById(id);
    }

    static validateFields({ nombre, direccion }) {
        if (!nombre || !nombre.trim()) throw new Error('El nombre es obligatorio.');
        if (nombre.trim().length < 2) throw new Error('El nombre debe tener al menos 2 caracteres.');
        
        if (!direccion || !direccion.trim()) throw new Error('La dirección es obligatoria.');
        if (direccion.trim().length < 5) throw new Error('La dirección debe tener al menos 5 caracteres.');
    }
}

module.exports = BranchService;