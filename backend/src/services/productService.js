const Product = require('../models/Product');
const Category = require('../models/Category');

class ProductService {
    static async getAll() {
        return Product.findAll();
    }

    static async getActiveAll() {
        return Product.findActiveAll();
    }

    static async getById(id) {
        const product = await Product.findById(id);
        if (!product) throw new Error('Producto no encontrado.');
        return product;
    }

    static async search(term) {
        const trimmed = term ? term.trim() : '';
        if (!trimmed) return this.getAll();
        return Product.search(trimmed);
    }

    static async create({ id_categoria, nombre, descripcion, precio, stock_minimo, imagen, estado }) {
        this.validateFields({ id_categoria, nombre, precio });
        this.validateStockMinimo(stock_minimo);

        await this.ensureCategory(id_categoria);

        const productId = await Product.create({
            id_categoria,
            nombre: nombre.trim(),
            descripcion: descripcion ? descripcion.trim() : null,
            precio,
            stock_minimo,
            imagen: imagen ? imagen.trim() : null,
            estado: estado === undefined ? true : !!estado
        });

        return this.getById(productId);
    }

    static async update(id, { id_categoria, nombre, descripcion, precio, stock_minimo, imagen, estado }) {
        this.validateFields({ id_categoria, nombre, precio });
        this.validateStockMinimo(stock_minimo);

        const existingProduct = await Product.findById(id);
        if (!existingProduct) throw new Error('Producto no encontrado.');

        await this.ensureCategory(id_categoria);

        await Product.update(id, {
            id_categoria,
            nombre: nombre.trim(),
            descripcion: descripcion ? descripcion.trim() : null,
            precio,
            stock_minimo,
            imagen: imagen ? imagen.trim() : null,
            estado: estado === undefined ? existingProduct.estado : !!estado
        });

        return this.getById(id);
    }

    static async toggleStatus(id) {
        const product = await Product.findById(id);
        if (!product) throw new Error('Producto no encontrado.');

        const newStatus = !product.estado;
        await Product.updateStatus(id, newStatus);

        return this.getById(id);
    }

    static async ensureCategory(idCategoria) {
        const category = await Category.findById(idCategoria);
        if (!category) throw new Error('La categoría seleccionada no existe.');
        if (!category.estado) throw new Error('La categoría seleccionada está inactiva.');
    }

    static validateFields({ id_categoria, nombre, precio }) {
        if (!id_categoria) {
            throw new Error('Debe seleccionar una categoría.');
        }

        if (!nombre || !nombre.trim()) {
            throw new Error('El nombre del producto es obligatorio.');
        }

        if (nombre.trim().length < 2) {
            throw new Error('El nombre del producto debe tener al menos 2 caracteres.');
        }

        if (precio === undefined || precio === null || precio === '') {
            throw new Error('El precio es obligatorio.');
        }

        const price = Number(precio);
        if (Number.isNaN(price) || price <= 0) {
            throw new Error('El precio debe ser un número mayor a cero.');
        }
    }

    static validateStockMinimo(stock_minimo) {
        if (stock_minimo === undefined || stock_minimo === null || stock_minimo === '') {
            throw new Error('El stock mínimo es obligatorio.');
        }

        const value = Number(stock_minimo);
        if (Number.isNaN(value) || value < 0) {
            throw new Error('El stock mínimo no puede ser un número negativo.');
        }
    }
}

module.exports = ProductService;
