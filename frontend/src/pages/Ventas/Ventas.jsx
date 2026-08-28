import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getBranches } from '../../services/branchService';
import { getCustomers } from '../../services/customerService';
import {
    getSales,
    getSaleById,
    getProductsForSale,
    createSale
} from '../../services/saleService';

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
);
const ReceiptIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z" /><path d="M14 8H8" /><path d="M16 12H8" /><path d="M13 16H8" /></svg>
);
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
);
const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
);

const EMPTY_CART = [];

export default function Ventas() {
    const { user } = useAuth();
    const [branches, setBranches] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [cart, setCart] = useState(EMPTY_CART);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [sales, setSales] = useState([]);
    const [loadingSales, setLoadingSales] = useState(true);
    const [showDetail, setShowDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const branchesRes = await getBranches();
                setBranches(branchesRes.data);
                const customersRes = await getCustomers();
                setCustomers(customersRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        load();
    }, []);

    const canRegister = user?.rol === 'ADMINISTRADOR' || user?.rol === 'ENCARGADO_SUCURSAL' || user?.rol === 'VENDEDOR';

    const loadSales = async (branchId) => {
        try {
            setLoadingSales(true);
            const response = await getSales(branchId || null);
            setSales(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingSales(false);
        }
    };

    useEffect(() => {
        loadSales(selectedBranch || null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBranch]);

    const loadProducts = async (branchId) => {
        try {
            setLoadingProducts(true);
            setError('');
            const response = await getProductsForSale(branchId);
            setProducts(response.data);
        } catch (err) {
            setProducts([]);
            setError(err.message || 'Error al obtener los productos.');
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleBranchChange = (e) => {
        const branchId = e.target.value;
        setSelectedBranch(branchId);
        setCart(EMPTY_CART);
        if (branchId) {
            loadProducts(branchId);
        } else {
            setProducts([]);
        }
    };

    const filteredProducts = useMemo(() => {
        if (!search.trim()) return products;
        const term = search.toLowerCase();
        return products.filter(
            (p) =>
                p.nombre.toLowerCase().includes(term) ||
                (p.categoria_nombre && p.categoria_nombre.toLowerCase().includes(term))
        );
    }, [products, search]);

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id_producto === product.id_producto);
            if (existing) {
                return prev.map((item) =>
                    item.id_producto === product.id_producto
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            }
            return [
                ...prev,
                {
                    id_producto: product.id_producto,
                    nombre: product.nombre,
                    precio: product.precio,
                    stock_actual: product.stock_actual,
                    cantidad: 1
                }
            ];
        });
    };

    const updateCartQuantity = (id_producto, value) => {
        const quantity = Number(value);
        if (Number.isNaN(quantity) || quantity < 1) return;
        setCart((prev) =>
            prev.map((item) =>
                item.id_producto === id_producto ? { ...item, cantidad: quantity > item.stock_actual ? item.stock_actual : quantity } : item
            )
        );
    };

    const removeFromCart = (id_producto) => {
        setCart((prev) => prev.filter((item) => item.id_producto !== id_producto));
    };

    const cartTotal = useMemo(() => {
        return cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    }, [cart]);

    const validateSale = () => {
        if (!selectedBranch) return 'Debe seleccionar una sucursal.';
        if (cart.length === 0) return 'Debe agregar al menos un producto a la venta.';
        for (const item of cart) {
            if (item.cantidad <= 0) return `La cantidad de "${item.nombre}" debe ser mayor a cero.`;
            if (item.cantidad > item.stock_actual) return `Stock insuficiente para "${item.nombre}". Disponible: ${item.stock_actual}.`;
        }
        return '';
    };

    const resetSale = () => {
        setCart(EMPTY_CART);
        setSelectedCustomer('');
        setSearch('');
    };

    const handleConfirm = async (e) => {
        e.preventDefault();
        const validationError = validateSale();
        if (validationError) { setError(validationError); return; }
        setError('');

        try {
            setSubmitting(true);
            const detalles = cart.map((item) => ({
                id_producto: item.id_producto,
                cantidad: item.cantidad
            }));
            await createSale({
                id_cliente: selectedCustomer || null,
                id_sucursal: Number(selectedBranch),
                detalles
            });
            setSuccessMsg('Venta registrada correctamente.');
            setTimeout(() => setSuccessMsg(''), 3000);
            resetSale();
            loadSales(selectedBranch || null);
        } catch (err) {
            setError(err.message || 'Error al registrar la venta.');
        } finally {
            setSubmitting(false);
        }
    };

    const openDetail = async (id) => {
        try {
            setDetailLoading(true);
            const response = await getSaleById(id);
            setShowDetail(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setDetailLoading(false);
        }
    };

    const formatPrice = (value) => {
        return new Intl.NumberFormat('es-BO', {
            style: 'currency',
            currency: 'BOB'
        }).format(value);
    };

    const formatDate = (value) => {
        const date = new Date(value);
        return date.toLocaleString('es-BO', {
            dateStyle: 'short',
            timeStyle: 'short'
        });
    };

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-title font-bold text-text-primary">Registrar Venta</h1>
                    <p className="text-text-secondary text-sm mt-1">Registra las ventas realizadas en una sucursal</p>
                </div>
            </div>

            {error && <div className="p-3 mb-4 rounded-input bg-error/10 border border-error text-error text-sm">{error}</div>}
            {successMsg && <div className="p-3 mb-4 rounded-input bg-fresh/10 border border-fresh text-green-800 text-sm">{successMsg}</div>}

            {/* Punto de venta */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Columna: seleccion de sucursal y catalogo */}
                <div className="space-y-6">
                    <div className="glass-card rounded-card p-5">
                        <label className="block text-sm font-medium text-text-primary mb-2">Sucursal *</label>
                        <select
                            value={selectedBranch}
                            onChange={handleBranchChange}
                            className="w-full px-4 py-3 rounded-input border border-border bg-white/60 focus:ring-2 focus:ring-primary outline-none"
                        >
                            <option value="">Seleccionar sucursal...</option>
                            {branches.filter((b) => b.estado).map((branch) => (
                                <option key={branch.id_sucursal} value={branch.id_sucursal}>{branch.nombre}</option>
                            ))}
                        </select>
                        {selectedBranch && (
                            <div className="relative mt-4">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"><SearchIcon /></span>
                                <input type="text" placeholder="Buscar producto..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-input border border-border bg-white/60 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" />
                            </div>
                        )}
                    </div>

                    {/* Catalogo de productos */}
                    <div className="glass-card rounded-card overflow-hidden">
                        <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
                            <h3 className="font-title font-bold text-text-primary">Productos</h3>
                            {selectedBranch && <span className="text-xs text-text-secondary">{products.filter((p) => p.stock_actual > 0).length} disponibles</span>}
                        </div>
                        {!selectedBranch ? (
                            <div className="flex flex-col items-center justify-center py-12 text-text-secondary text-sm px-6 text-center">
                                Selecciona una sucursal para ver los productos disponibles.
                            </div>
                        ) : loadingProducts ? (
                            <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div></div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-text-secondary text-sm px-6 text-center">
                                No se encontraron productos para esta sucursal.
                            </div>
                        ) : (
                            <div className="max-h-[440px] overflow-y-auto divide-y divide-border/30">
                                {filteredProducts.map((product) => {
                                    const outOfStock = product.stock_actual <= 0;
                                    return (
                                        <button
                                            key={product.id_producto}
                                            disabled={outOfStock}
                                            onClick={() => addToCart(product)}
                                            className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${outOfStock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/5'}`}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold text-text-primary text-sm truncate">{product.nombre}</p>
                                                    {product.categoria_nombre && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary flex-shrink-0">{product.categoria_nombre}</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 mt-1 text-sm">
                                                    <span className="font-bold text-primary">{formatPrice(product.precio)}</span>
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${outOfStock ? 'bg-error/10 text-error' : 'bg-fresh/10 text-green-700'}`}>
                                                        {outOfStock ? 'Sin stock' : `Stock: ${product.stock_actual}`}
                                                    </span>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Columna: carrito */}
                <div className="glass-card rounded-card overflow-hidden">
                    <div className="px-5 py-4 border-b border-border/50 flex items-center gap-2">
                        <span className="text-primary"><CartIcon /></span>
                        <h3 className="font-title font-bold text-text-primary">Detalle de la Venta</h3>
                    </div>

                    <div className="p-5">
                        <label className="block text-sm font-medium text-text-primary mb-2">Cliente (opcional)</label>
                        <select
                            value={selectedCustomer}
                            onChange={(e) => setSelectedCustomer(e.target.value)}
                            className="w-full px-4 py-3 rounded-input border border-border bg-white/60 focus:ring-2 focus:ring-primary outline-none"
                        >
                            <option value="">Cliente por defecto / mostrador</option>
                            {customers.map((customer) => (
                                <option key={customer.id_cliente} value={customer.id_cliente}>
                                    {customer.nombres} {customer.apellidos}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="px-5 max-h-[280px] overflow-y-auto">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-text-secondary text-sm text-center">
                                Aun no has agregado productos a la venta.
                            </div>
                        ) : (
                            <div className="divide-y divide-border/30">
                                {cart.map((item) => (
                                    <div key={item.id_producto} className="py-3">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-text-primary text-sm truncate">{item.nombre}</p>
                                                <p className="text-xs text-text-secondary">{formatPrice(item.precio)} x {item.cantidad}</p>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id_producto)} className="p-2 rounded-xl text-text-secondary hover:text-error hover:bg-error/10 transition-all" title="Eliminar"><TrashIcon /></button>
                                        </div>
                                        <div className="flex items-center justify-between gap-3 mt-2">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => updateCartQuantity(item.id_producto, item.cantidad - 1)} className="w-8 h-8 rounded-xl border border-border text-text-secondary hover:bg-primary/5 transition-all">-</button>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={item.stock_actual}
                                                    value={item.cantidad}
                                                    onChange={(e) => updateCartQuantity(item.id_producto, e.target.value)}
                                                    className="w-16 px-2 py-1.5 text-center rounded-input border border-border bg-white/60 focus:ring-2 focus:ring-primary outline-none"
                                                />
                                                <button onClick={() => updateCartQuantity(item.id_producto, item.cantidad + 1)} className="w-8 h-8 rounded-xl border border-border text-text-secondary hover:bg-primary/5 transition-all">+</button>
                                            </div>
                                            <span className="text-sm font-bold text-text-primary">{formatPrice(item.precio * item.cantidad)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-5 border-t border-border/50">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-text-secondary">Total</span>
                            <span className="text-2xl font-title font-bold text-primary">{formatPrice(cartTotal)}</span>
                        </div>
                        <button
                            onClick={handleConfirm}
                            disabled={submitting || !canRegister}
                            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-btn bg-gradient-to-r from-primary to-secondary text-white font-medium text-sm shadow-md hover:brightness-110 disabled:opacity-70 transition-all"
                        >
                            {submitting && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>}
                            {submitting ? 'Registrando venta...' : 'Confirmar Venta'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Lista de ventas */}
            <div className="glass-card rounded-card overflow-hidden">
                <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
                    <h3 className="font-title font-bold text-text-primary">Ventas Realizadas</h3>
                    <span className="text-xs text-text-secondary">{sales.length} ventas</span>
                </div>
                {loadingSales ? (
                    <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div></div>
                ) : sales.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-text-secondary">No se encontraron ventas</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/50 text-left text-xs font-semibold text-text-secondary uppercase">
                                    <th className="px-6 py-4">N°</th>
                                    <th className="px-6 py-4">Fecha</th>
                                    <th className="px-6 py-4">Sucursal</th>
                                    <th className="px-6 py-4">Vendedor</th>
                                    <th className="px-6 py-4">Cliente</th>
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sales.map((sale) => (
                                    <tr key={sale.id_venta} className="border-b border-border/30 hover:bg-primary/5 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-text-primary">#{sale.id_venta}</td>
                                        <td className="px-6 py-4 text-sm text-text-secondary">{formatDate(sale.fecha_venta)}</td>
                                        <td className="px-6 py-4 text-sm text-text-secondary">{sale.sucursal}</td>
                                        <td className="px-6 py-4 text-sm text-text-secondary">{sale.usuario}</td>
                                        <td className="px-6 py-4 text-sm text-text-secondary">{sale.cliente || '-'}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-primary">{formatPrice(sale.total)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end">
                                                <button onClick={() => openDetail(sale.id_venta)} className="p-2 rounded-xl text-text-secondary hover:text-secondary hover:bg-secondary/10" title="Ver detalle"><EyeIcon /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal de detalle */}
            {showDetail && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="glass-card rounded-card w-full max-w-lg p-6 animate-scale-in">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-title font-bold text-text-primary flex items-center gap-2"><ReceiptIcon /> Venta #{showDetail.id_venta}</h3>
                            <button onClick={() => setShowDetail(null)} className="p-2 rounded-xl hover:bg-primary/10"><CloseIcon /></button>
                        </div>
                        {detailLoading ? (
                            <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div></div>
                        ) : (
                            <>
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between py-1 border-b border-border/30"><span className="text-sm text-text-secondary">Sucursal</span><span className="text-sm font-medium">{showDetail.sucursal}</span></div>
                                    <div className="flex justify-between py-1 border-b border-border/30"><span className="text-sm text-text-secondary">Vendedor</span><span className="text-sm font-medium">{showDetail.usuario}</span></div>
                                    <div className="flex justify-between py-1 border-b border-border/30"><span className="text-sm text-text-secondary">Cliente</span><span className="text-sm font-medium">{showDetail.cliente || 'Mostrador'}</span></div>
                                    <div className="flex justify-between py-1 border-b border-border/30"><span className="text-sm text-text-secondary">Fecha</span><span className="text-sm font-medium">{formatDate(showDetail.fecha_venta)}</span></div>
                                </div>

                                <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-text-primary mb-2">Productos</h4>
                                    <div className="divide-y divide-border/30">
                                        {showDetail.detalles.map((d) => (
                                            <div key={d.id_detalle_venta} className="flex items-center justify-between py-2">
                                                <div>
                                                    <p className="text-sm font-medium text-text-primary">{d.producto}</p>
                                                    <p className="text-xs text-text-secondary">{formatPrice(d.precio_unitario)} x {d.cantidad}</p>
                                                </div>
                                                <span className="text-sm font-bold text-text-primary">{formatPrice(d.subtotal)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                                    <span className="font-title font-bold text-text-primary">Total</span>
                                    <span className="text-xl font-title font-bold text-primary">{formatPrice(showDetail.total)}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
