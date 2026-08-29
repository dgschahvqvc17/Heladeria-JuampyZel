import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    getProducts,
    createProduct,
    updateProduct,
    toggleProductStatus,
    getImageUrl
} from '../../services/productService';
import {
    getCategories,
    createCategory,
    updateCategory,
    toggleCategoryStatus
} from '../../services/categoryService';

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
);
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
);
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
);
const TagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
);

const EMPTY_PRODUCT = {
    nombre: '',
    descripcion: '',
    id_categoria: '',
    precio: '',
    stock_minimo: 5,
    imagen: '',
    estado: true
};

const EMPTY_CATEGORY = { nombre: '', descripcion: '' };

export default function Productos() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState(EMPTY_PRODUCT);
    const [productError, setProductError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [showDetail, setShowDetail] = useState(null);
    const [activeTab, setActiveTab] = useState('productos');
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [categoryForm, setCategoryForm] = useState(EMPTY_CATEGORY);
    const [categoryError, setCategoryError] = useState('');

    const canManage = user?.rol === 'ADMINISTRADOR';

    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await getProducts();
            setProducts(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await getCategories();
            setCategories(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const reloadAll = async () => {
        await Promise.all([loadProducts(), loadCategories()]);
    };

    useEffect(() => {
        reloadAll();
    }, []);

    const filteredProducts = useMemo(() => {
        if (!search.trim()) return products;
        const term = search.toLowerCase();
        return products.filter(
            (p) =>
                p.nombre.toLowerCase().includes(term) ||
                (p.descripcion && p.descripcion.toLowerCase().includes(term)) ||
                (p.categoria_nombre && p.categoria_nombre.toLowerCase().includes(term))
        );
    }, [products, search]);

    const openProductForm = (product) => {
        setEditingProduct(product);
        setImageFile(null);
        setImagePreview(product ? getImageUrl(product.imagen) || '' : '');
        setProductForm(
            product
                ? {
                      nombre: product.nombre,
                      descripcion: product.descripcion || '',
                      id_categoria: product.id_categoria,
                      precio: product.precio,
                      stock_minimo: product.stock_minimo,
                      imagen: product.imagen || '',
                      estado: product.estado
                  }
                : EMPTY_PRODUCT
        );
        setProductError('');
        setShowProductForm(true);
    };

    const closeProductForm = () => {
        setShowProductForm(false);
        setEditingProduct(null);
        setImageFile(null);
        setImagePreview('');
        setProductForm(EMPTY_PRODUCT);
        setProductError('');
    };

    const handleProductChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProductForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) {
            setImageFile(null);
            setImagePreview('');
            return;
        }
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const validateProduct = () => {
        if (!productForm.nombre.trim()) return 'El nombre del producto es obligatorio.';
        if (productForm.nombre.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres.';
        if (!productForm.id_categoria) return 'Debe seleccionar una categoría.';
        if (productForm.precio === '' || productForm.precio === null) return 'El precio es obligatorio.';
        const price = Number(productForm.precio);
        if (Number.isNaN(price) || price <= 0) return 'El precio debe ser un número mayor a cero.';
        if (productForm.stock_minimo === '' || productForm.stock_minimo === null) return 'El stock mínimo es obligatorio.';
        if (Number(productForm.stock_minimo) < 0) return 'El stock mínimo no puede ser negativo.';
        return '';
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        const error = validateProduct();
        if (error) { setProductError(error); return; }

        try {
            setSubmitting(true);
            setProductError('');
            const payload = {
                ...productForm,
                nombre: productForm.nombre.trim(),
                descripcion: productForm.descripcion.trim(),
                precio: Number(productForm.precio),
                stock_minimo: Number(productForm.stock_minimo),
                estado: productForm.estado,
                imageFile
            };
            if (editingProduct) {
                await updateProduct(editingProduct.id_producto, payload);
            } else {
                await createProduct(payload);
            }
            closeProductForm();
            loadProducts();
        } catch (err) {
            setProductError(err.message || 'Error al guardar el producto.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleProduct = async (product) => {
        try {
            await toggleProductStatus(product.id_producto);
            loadProducts();
        } catch (error) {
            console.error(error);
        }
    };

    const openCategoryForm = (category) => {
        setEditingCategory(category);
        setCategoryForm(
            category
                ? { nombre: category.nombre, descripcion: category.descripcion || '' }
                : EMPTY_CATEGORY
        );
        setCategoryError('');
        setShowCategoryForm(true);
    };

    const closeCategoryForm = () => {
        setShowCategoryForm(false);
        setEditingCategory(null);
        setCategoryForm(EMPTY_CATEGORY);
        setCategoryError('');
    };

    const handleCategoryChange = (e) => {
        const { name, value } = e.target;
        setCategoryForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        if (!categoryForm.nombre.trim()) { setCategoryError('El nombre de la categoría es obligatorio.'); return; }
        if (categoryForm.nombre.trim().length < 2) { setCategoryError('El nombre debe tener al menos 2 caracteres.'); return; }

        try {
            setSubmitting(true);
            setCategoryError('');
            const payload = {
                nombre: categoryForm.nombre.trim(),
                descripcion: categoryForm.descripcion.trim()
            };
            if (editingCategory) {
                await updateCategory(editingCategory.id_categoria, payload);
            } else {
                await createCategory(payload);
            }
            closeCategoryForm();
            loadCategories();
        } catch (err) {
            setCategoryError(err.message || 'Error al guardar la categoría.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleCategory = async (category) => {
        try {
            await toggleCategoryStatus(category.id_categoria);
            loadCategories();
        } catch (error) {
            console.error(error);
        }
    };

    const formatPrice = (value) => {
        return new Intl.NumberFormat('es-BO', {
            style: 'currency',
            currency: 'BOB'
        }).format(value);
    };

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-title font-bold text-text-primary">Gestionar Productos y Categorías</h1>
                    <p className="text-text-secondary text-sm mt-1">Mantén actualizado el catálogo de productos de JuampyZel</p>
                </div>
                {canManage && (
                    <div className="flex gap-2">
                        <button onClick={() => openCategoryForm()} className="flex items-center gap-2 px-5 py-2.5 rounded-btn border border-primary/40 text-primary font-medium text-sm hover:bg-primary/10 transition-all">
                            <TagIcon /> Nueva Categoría
                        </button>
                        <button onClick={() => openProductForm()} className="flex items-center gap-2 px-5 py-2.5 rounded-btn bg-gradient-to-r from-primary to-secondary text-white font-medium text-sm hover:brightness-110 shadow-md">
                            <PlusIcon /> Nuevo Producto
                        </button>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('productos')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'productos' ? 'bg-gradient-to-r from-primary/15 to-secondary/15 text-primary' : 'text-text-secondary hover:bg-primary/5'}`}
                >
                    Productos ({products.length})
                </button>
                <button
                    onClick={() => setActiveTab('categorias')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'categorias' ? 'bg-gradient-to-r from-primary/15 to-secondary/15 text-primary' : 'text-text-secondary hover:bg-primary/5'}`}
                >
                    Categorías ({categories.length})
                </button>
            </div>

            {activeTab === 'productos' ? (
                <>
                    <div className="glass-card rounded-card p-4 mb-6">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"><SearchIcon /></span>
                            <input type="text" placeholder="Buscar por nombre, descripción o categoría..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-input border border-border bg-white/60 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" />
                        </div>
                    </div>

                    <div className="glass-card rounded-card overflow-hidden">
                        {loading ? (
                            <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div></div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-text-secondary">No se encontraron productos</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border/50 text-left text-xs font-semibold text-text-secondary uppercase">
                                            <th className="px-6 py-4">Producto</th>
                                            <th className="px-6 py-4">Categoría</th>
                                            <th className="px-6 py-4">Precio</th>
                                            <th className="px-6 py-4">Stock mín.</th>
                                            <th className="px-6 py-4">Estado</th>
                                            <th className="px-6 py-4 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map((product) => (
                                            <tr key={product.id_producto} className="border-b border-border/30 hover:bg-primary/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center flex-shrink-0">
                                                            {product.imagen ? (
                                                                <img src={getImageUrl(product.imagen)} alt={product.nombre} className="w-full h-full object-contain" />
                                                            ) : (
                                                                <span className="text-lg">🍦</span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-text-primary text-sm">{product.nombre}</p>
                                                            {product.descripcion && <p className="text-xs text-text-secondary truncate max-w-[220px]">{product.descripcion}</p>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">{product.categoria_nombre}</span></td>
                                                <td className="px-6 py-4 text-sm font-semibold text-text-primary">{formatPrice(product.precio)}</td>
                                                <td className="px-6 py-4 text-sm text-text-secondary">{product.stock_minimo}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${product.estado ? 'bg-fresh/10 text-green-700' : 'bg-error/10 text-error'}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${product.estado ? 'bg-green-500' : 'bg-error'}`}></span>
                                                        {product.estado ? 'Disponible' : 'No disponible'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => setShowDetail(product)} className="p-2 rounded-xl text-text-secondary hover:text-secondary hover:bg-secondary/10" title="Ver detalle"><EyeIcon /></button>
                                                        {canManage && (
                                                            <>
                                                                <button onClick={() => openProductForm(product)} className="p-2 rounded-xl text-text-secondary hover:text-primary hover:bg-primary/10" title="Editar"><EditIcon /></button>
                                                                <button onClick={() => handleToggleProduct(product)} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${product.estado ? 'text-error hover:bg-error/10' : 'text-fresh hover:bg-fresh/10'}`} title={product.estado ? 'Desactivar' : 'Activar'}>
                                                                    {product.estado ? 'Desactivar' : 'Activar'}
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="glass-card rounded-card overflow-hidden">
                    {categories.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-text-secondary">No se encontraron categorías</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border/50 text-left text-xs font-semibold text-text-secondary uppercase">
                                        <th className="px-6 py-4">Categoría</th>
                                        <th className="px-6 py-4">Descripción</th>
                                        <th className="px-6 py-4">Productos</th>
                                        <th className="px-6 py-4">Estado</th>
                                        <th className="px-6 py-4 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((category) => (
                                        <tr key={category.id_categoria} className="border-b border-border/30 hover:bg-primary/5 transition-colors">
                                            <td className="px-6 py-4 font-semibold text-text-primary">{category.nombre}</td>
                                            <td className="px-6 py-4 text-sm text-text-secondary">{category.descripcion || '-'}</td>
                                            <td className="px-6 py-4 text-sm text-text-secondary">{category.cantidad_productos ?? 0}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${category.estado ? 'bg-fresh/10 text-green-700' : 'bg-error/10 text-error'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${category.estado ? 'bg-green-500' : 'bg-error'}`}></span>
                                                    {category.estado ? 'Activa' : 'Inactiva'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    {canManage && (
                                                        <>
                                                            <button onClick={() => openCategoryForm(category)} className="p-2 rounded-xl text-text-secondary hover:text-primary hover:bg-primary/10" title="Editar"><EditIcon /></button>
                                                            <button onClick={() => handleToggleCategory(category)} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${category.estado ? 'text-error hover:bg-error/10' : 'text-fresh hover:bg-fresh/10'}`} title={category.estado ? 'Desactivar' : 'Activar'}>
                                                                {category.estado ? 'Desactivar' : 'Activar'}
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Product Detail Modal */}
            {showDetail && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="glass-card rounded-card w-full max-w-md p-6 animate-scale-in">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-title font-bold text-text-primary">Detalle del Producto</h3>
                            <button onClick={() => setShowDetail(null)} className="p-2 rounded-xl hover:bg-primary/10"><CloseIcon /></button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center flex-shrink-0">
                                    {showDetail.imagen ? (
                                        <img src={getImageUrl(showDetail.imagen)} alt={showDetail.nombre} className="w-full h-full object-contain" />
                                    ) : (
                                        <span className="text-3xl">🍦</span>
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-text-primary">{showDetail.nombre}</h4>
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary mt-1">{showDetail.categoria_nombre}</span>
                                </div>
                            </div>
                            {showDetail.descripcion && (
                                <p className="text-sm text-text-secondary border-b border-border/30 pb-3">{showDetail.descripcion}</p>
                            )}
                            <div className="flex justify-between py-2 border-b border-border/30"><span className="text-sm text-text-secondary">Precio</span><span className="text-sm font-bold text-primary">{formatPrice(showDetail.precio)}</span></div>
                            <div className="flex justify-between py-2 border-b border-border/30"><span className="text-sm text-text-secondary">Stock mínimo</span><span className="text-sm font-medium text-text-primary">{showDetail.stock_minimo}</span></div>
                            <div className="flex justify-between py-2"><span className="text-sm text-text-secondary">Disponibilidad</span>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${showDetail.estado ? 'bg-fresh/10 text-green-700' : 'bg-error/10 text-error'}`}>
                                    {showDetail.estado ? 'Disponible' : 'No disponible'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Product Create / Edit Modal */}
            {showProductForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="glass-card rounded-card w-full max-w-lg p-6 animate-scale-in">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-title font-bold text-text-primary">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                            <button onClick={closeProductForm} className="p-2 rounded-xl hover:bg-primary/10"><CloseIcon /></button>
                        </div>
                        {productError && <div className="p-3 mb-4 rounded-input bg-error/10 text-error text-sm">{productError}</div>}
                        <form onSubmit={handleProductSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">Nombre del producto *</label>
                                <input type="text" name="nombre" value={productForm.nombre} onChange={handleProductChange} className="w-full px-4 py-3 rounded-input border border-border bg-white/60 focus:ring-2 focus:ring-primary outline-none" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">Categoría *</label>
                                    <select name="id_categoria" value={productForm.id_categoria} onChange={handleProductChange} className="w-full px-4 py-3 rounded-input border border-border bg-white/60 focus:ring-2 focus:ring-primary outline-none">
                                        <option value="">Seleccionar categoría...</option>
                                        {categories.filter((c) => c.estado).map((category) => (
                                            <option key={category.id_categoria} value={category.id_categoria}>{category.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">Precio (Bs) *</label>
                                    <input type="number" name="precio" min="0.01" step="0.01" value={productForm.precio} onChange={handleProductChange} className="w-full px-4 py-3 rounded-input border border-border bg-white/60 focus:ring-2 focus:ring-primary outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">Descripción</label>
                                <textarea name="descripcion" value={productForm.descripcion} onChange={handleProductChange} rows="3" className="w-full px-4 py-3 rounded-input border border-border bg-white/60 focus:ring-2 focus:ring-primary outline-none resize-none"></textarea>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">Stock mínimo</label>
                                    <input type="number" name="stock_minimo" min="0" value={productForm.stock_minimo} onChange={handleProductChange} className="w-full px-4 py-3 rounded-input border border-border bg-white/60 focus:ring-2 focus:ring-primary outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">Imagen</label>
                                    <input type="file" name="imagen" accept="image/*" onChange={handleImageChange} className="w-full text-sm text-text-secondary file:mr-3 file:px-4 file:py-2.5 file:rounded-btn file:border-0 file:bg-primary/10 file:text-primary file:font-medium file:cursor-pointer hover:file:bg-primary/20" />
                                    {imagePreview && (
                                        <img src={imagePreview} alt="Vista previa" className="mt-3 w-24 h-24 rounded-xl object-contain border border-border bg-white/40" />
                                    )}
                                </div>
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer select-none">
                                <input type="checkbox" name="estado" checked={productForm.estado} onChange={handleProductChange} className="w-5 h-5 rounded border-border text-primary focus:ring-primary" />
                                <span className="text-sm font-medium text-text-primary">Producto disponible</span>
                            </label>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={closeProductForm} className="px-5 py-2.5 rounded-btn border border-border text-text-secondary hover:bg-primary/5 text-sm transition-all">Cancelar</button>
                                <button type="submit" disabled={submitting} className="flex items-center gap-2 px-5 py-2.5 rounded-btn bg-gradient-to-r from-primary to-secondary text-white text-sm shadow-md disabled:opacity-70">
                                    {submitting && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>}
                                    {editingProduct ? 'Guardar Cambios' : 'Registrar Producto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Category Create / Edit Modal */}
            {showCategoryForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="glass-card rounded-card w-full max-w-md p-6 animate-scale-in">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-title font-bold text-text-primary">{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
                            <button onClick={closeCategoryForm} className="p-2 rounded-xl hover:bg-primary/10"><CloseIcon /></button>
                        </div>
                        {categoryError && <div className="p-3 mb-4 rounded-input bg-error/10 text-error text-sm">{categoryError}</div>}
                        <form onSubmit={handleCategorySubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">Nombre *</label>
                                <input type="text" name="nombre" value={categoryForm.nombre} onChange={handleCategoryChange} className="w-full px-4 py-3 rounded-input border border-border bg-white/60 focus:ring-2 focus:ring-primary outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">Descripción</label>
                                <textarea name="descripcion" value={categoryForm.descripcion} onChange={handleCategoryChange} rows="3" className="w-full px-4 py-3 rounded-input border border-border bg-white/60 focus:ring-2 focus:ring-primary outline-none resize-none"></textarea>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={closeCategoryForm} className="px-5 py-2.5 rounded-btn border border-border text-text-secondary hover:bg-primary/5 text-sm transition-all">Cancelar</button>
                                <button type="submit" disabled={submitting} className="flex items-center gap-2 px-5 py-2.5 rounded-btn bg-gradient-to-r from-primary to-secondary text-white text-sm shadow-md disabled:opacity-70">
                                    {submitting && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>}
                                    {editingCategory ? 'Guardar Cambios' : 'Registrar Categoría'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
