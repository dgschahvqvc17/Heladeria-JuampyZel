const Category = require('../models/Category');

class CategoryService {
    static async getAll() {
        return Category.findAll();
    }

    static async getActiveAll() {
        return Category.findActiveAll();
    }

    static async getById(id) {
        const category = await Category.findById(id);
        if (!category) throw new Error('Categoría no encontrada.');
        return category;
    }

    static async create({ nombre, descripcion }) {
        this.validateFields({ nombre });

        const existing = await Category.findByName(nombre.trim());
        if (existing) throw new Error('La categoría ya está registrada.');

        const categoryId = await Category.create({
            nombre: nombre.trim(),
            descripcion: descripcion ? descripcion.trim() : null
        });

        return this.getById(categoryId);
    }

    static async update(id, { nombre, descripcion }) {
        this.validateFields({ nombre });

        const existingCategory = await Category.findById(id);
        if (!existingCategory) throw new Error('Categoría no encontrada.');

        const duplicate = await Category.findByName(nombre.trim());
        if (duplicate && duplicate.id_categoria !== parseInt(id)) {
            throw new Error('El nombre de categoría ya está registrado por otra categoría.');
        }

        await Category.update(id, {
            nombre: nombre.trim(),
            descripcion: descripcion ? descripcion.trim() : null
        });

        return this.getById(id);
    }

    static async toggleStatus(id) {
        const category = await Category.findById(id);
        if (!category) throw new Error('Categoría no encontrada.');

        const newStatus = !category.estado;
        await Category.updateStatus(id, newStatus);

        return this.getById(id);
    }

    static validateFields({ nombre }) {
        if (!nombre || !nombre.trim()) {
            throw new Error('El nombre de la categoría es obligatorio.');
        }

        if (nombre.trim().length < 2) {
            throw new Error('El nombre de la categoría debe tener al menos 2 caracteres.');
        }
    }
}

module.exports = CategoryService;
