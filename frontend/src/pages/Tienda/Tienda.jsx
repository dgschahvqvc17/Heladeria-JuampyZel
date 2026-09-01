import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCatalog, createOrder, getOrders, getOrderById } from '../../services/orderService';
import { getImageUrl } from '../../services/productService';

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
);
const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
);
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
);
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
);
const MinusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
);
const IceCreamIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C9 2 7 4 7 7c0 2.5 2 4 5 4s5-1.5 5-4c0-3-2-5-5-5z" /><path d="M8 11l-3 9h14l-3-9" /><line x1="12" y1="15" x2="12" y2="20" /></svg>
);
const PackageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
);
const ShoppingBagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
);

const STATUS_OPTIONS = [
    { value: 'PENDIENTE', label: 'Pendiente' },
    { value: 'CONFIRMADO', label: 'Confirmado' },
    { value: 'PREPARANDO', label: 'Preparando' },
    { value: 'LISTO', label: 'Listo' },
    { value: 'ENTREGADO', label: 'Entregado' },
    { value: 'CANCELADO', label: 'Cancelado' }
];

const getStatusStyle = (estado) => {
    switch (estado) {
        case 'CONFIRMADO': return 'bg-secondary/10 text-secondary';
        case 'PREPARANDO': return 'bg-accent/10 text-amber-700';
        case 'LISTO': return 'bg-primary/10 text-primary';
        case 'ENTREGADO': return 'bg-fresh/10 text-green-700';
        case 'CANCELADO': return 'bg-error/10 text-error';
        default: return 'bg-primary/10 text-primary';
    }
};

export default function Tienda() {
    const { user } = useAuth();
    const [tab, setTab] = useState('catalogo');

    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [cart, setCart] = useState([]);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [showDetail, setShowDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const [showCart, setShowCart] = useState(false);

    const loadCatalog = async () => {
        try {
            setLoadingProducts(true);
            const response = await getCatalog();
            setProducts(response.data);
        } catch (err) {
            setError(err.message || 'Error al obtener el catalogo.');
        } finally {
            setLoadingProducts(false);
        }
    };

    const loadOrders = async () => {
        try {
            setLoadingOrders(true);
            const response = await getOrders();
            setOrders(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingOrders(false);
        }
    };

    useEffect(() => {
        loadCatalog();
    }, []);

    const categories = useMemo(() => {
        const cats = [...new Set(products.map((p) => p.categoria_nombre).filter(Boolean))];
        return ['Todos', ...cats];
    }, [products]);

    const filteredProducts = useMemo(() => {
        let result = products;
        if (selectedCategory !== 'Todos') {
            result = result.filter((p) => p.categoria_nombre === selectedCategory);
        }
        if (search.trim()) {
            const term = search.toLowerCase();
            result = result.filter(
                (p) =>
                    p.nombre.toLowerCase().includes(term) ||
                    (p.descripcion && p.descripcion.toLowerCase().includes(term)) ||
                    (p.categoria_nombre && p.categoria_nombre.toLowerCase().includes(term))
            );
        }
        return result;
    }, [products, search, selectedCategory]);

    const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.cantidad, 0), [cart]);

    const cartTotal = useMemo(() => {
        return cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    }, [cart]);

    const getCartQuantity = (id_producto) => {
        const item = cart.find((i) => i.id_producto === id_producto);
        return item ? item.cantidad : 0;
    };

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id_producto === product.id_producto);
            if (existing) {
                if (existing.cantidad >= product.stock_disponible) return prev;
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
                    stock_disponible: product.stock_disponible,
                    imagen: product.imagen,
                    cantidad: 1
                }
            ];
        });
    };

    const decrementFromCart = (id_producto) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id_producto === id_producto);
            if (!existing) return prev;
            if (existing.cantidad <= 1) return prev.filter((item) => item.id_producto !== id_producto);
            return prev.map((item) =>
                item.id_producto === id_producto
                    ? { ...item, cantidad: item.cantidad - 1 }
                    : item
            );
        });
    };

    const removeFromCart = (id_producto) => {
        setCart((prev) => prev.filter((item) => item.id_producto !== id_producto));
    };

    const validateOrder = () => {
        if (cart.length === 0) return 'Debe agregar al menos un producto a su pedido.';
        for (const item of cart) {
            if (item.cantidad <= 0) return `La cantidad de "${item.nombre}" debe ser mayor a cero.`;
            if (item.cantidad > item.stock_disponible) return `Disponibilidad insuficiente para "${item.nombre}". Disponible: ${item.stock_disponible}.`;
        }
        return '';
    };

    const resetOrder = () => {
        setCart([]);
        setSearch('');
        setSelectedCategory('Todos');
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        const validationError = validateOrder();
        if (validationError) { setError(validationError); return; }
        setError('');

        try {
            setSubmitting(true);
            const detalles = cart.map((item) => ({
                id_producto: item.id_producto,
                cantidad: item.cantidad
            }));
            await createOrder({ detalles });
            setSuccessMsg('Pedido registrado correctamente.');
            setTimeout(() => setSuccessMsg(''), 3000);
            resetOrder();
            loadCatalog();
            loadOrders();
            setTab('pedidos');
            setShowCart(false);
        } catch (err) {
            setError(err.message || 'Error al registrar el pedido.');
        } finally {
            setSubmitting(false);
        }
    };

    const openDetail = async (id) => {
        try {
            setDetailLoading(true);
            const response = await getOrderById(id);
            setShowDetail(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setDetailLoading(false);
        }
    };

    const formatPrice = (value) => {
        return new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(value);
    };

    const formatDate = (value) => {
        return new Date(value).toLocaleString('es-BO', { dateStyle: 'short', timeStyle: 'short' });
    };

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-title font-bold text-text-primary">Portal de Tienda</h1>
                    <p className="text-text-secondary text-sm mt-1">
                        {user?.tienda?.nombre || user?.nombre} &middot; Solicita abastecimiento y consulta tus pedidos
                    </p>
                </div>
                {tab === 'catalogo' && cart.length > 0 && (
                    <button
                        onClick={() => setShowCart(true)}
                        className="sm:hidden flex items-center gap-2 px-4 py-2.5 rounded-btn bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium shadow-md"
                    >
                        <CartIcon />
                        <span>{cartCount} items</span>
                        <span className="font-bold">{formatPrice(cartTotal)}</span>
                    </button>
                )}
            </div>

            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => { setTab('catalogo'); setError(''); setSuccessMsg(''); }}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-btn text-sm font-medium transition-all ${tab === 'catalogo' ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md' : 'border border-border text-text-secondary hover:bg-primary/5'}`}
                >
                    <ShoppingBagIcon />
                    Catalogo
                </button>
                <button
                    onClick={() => { setTab('pedidos'); loadOrders(); setError(''); setSuccessMsg(''); }}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-btn text-sm font-medium transition-all ${tab === 'pedidos' ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md' : 'border border-border text-text-secondary hover:bg-primary/5'}`}
                >
                    <PackageIcon />
                    Mis Pedidos
                    {orders.length > 0 && tab !== 'pedidos' && (
                        <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary font-bold">{orders.length}</span>
                    )}
                </button>
            </div>

            {error && <div className="p-3 mb-4 rounded-input bg-error/10 border border-error text-error text-sm">{error}</div>}
            {successMsg && <div className="p-3 mb-4 rounded-input bg-fresh/10 border border-fresh text-green-800 text-sm">{successMsg}</div>}

            {tab === 'catalogo' && (
                <div className="flex gap-6">
                    <div className="flex-1 min-w-0">
                        <div className="glass-card rounded-card p-4 mb-5">
                            <div className="relative mb-4">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"><SearchIcon /></span>
                                <input
                                    type="text"
                                    placeholder="Buscar helados, paletas, especiales..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-input border border-border bg-white/60 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow text-sm"
                                />
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-1 -mb-1 scrollbar-none">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                                            selectedCategory === cat
                                                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                                                : 'bg-white/70 border border-border text-text-secondary hover:border-primary/40 hover:text-primary'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {loadingProducts ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="glass-card rounded-card overflow-hidden animate-pulse">
                                        <div className="aspect-[4/3] bg-border/50" />
                                        <div className="p-4 space-y-3">
                                            <div className="h-3 bg-border/50 rounded-full w-1/3" />
                                            <div className="h-4 bg-border/50 rounded-full w-3/4" />
                                            <div className="h-3 bg-border/50 rounded-full w-1/2" />
                                            <div className="h-8 bg-border/50 rounded-btn" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="glass-card rounded-card flex flex-col items-center justify-center py-16 text-text-secondary text-sm px-6 text-center">
                                <div className="mb-4 opacity-40"><IceCreamIcon /></div>
                                <p className="font-medium text-text-primary mb-1">No se encontraron productos</p>
                                <p className="text-xs">Intenta con otra busqueda o categoria</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {filteredProducts.map((product, idx) => {
                                    const outOfStock = product.stock_disponible <= 0;
                                    const inCart = getCartQuantity(product.id_producto);
                                    const imageUrl = getImageUrl(product.imagen);

                                    return (
                                        <div
                                            key={product.id_producto}
                                            className="glass-card rounded-card overflow-hidden group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 flex flex-col"
                                        >
                                            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5">
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt={product.nombre}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                                    />
                                                ) : null}
                                                <div className={`${imageUrl ? 'hidden' : 'flex'} w-full h-full items-center justify-center`}>
                                                    <IceCreamIcon />
                                                </div>
                                                {outOfStock && (
                                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                                                        <span className="px-3 py-1.5 rounded-full bg-white/90 text-error text-xs font-bold uppercase tracking-wide">Sin Stock</span>
                                                    </div>
                                                )}
                                                {product.categoria_nombre && (
                                                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-sm text-secondary shadow-sm">
                                                        {product.categoria_nombre}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="p-4 flex flex-col flex-1">
                                                <h3 className="font-title font-bold text-text-primary text-sm leading-tight mb-1 line-clamp-2">{product.nombre}</h3>
                                                {product.descripcion && (
                                                    <p className="text-xs text-text-secondary line-clamp-2 mb-3 flex-1">{product.descripcion}</p>
                                                )}
                                                {!product.descripcion && <div className="flex-1" />}

                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${outOfStock ? 'bg-error/10 text-error' : 'bg-fresh/10 text-green-700'}`}>
                                                        {outOfStock ? 'Sin stock' : `Disp: ${product.stock_disponible}`}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-lg font-title font-bold text-primary">{formatPrice(product.precio)}</span>
                                                    {outOfStock ? (
                                                        <button disabled className="px-3 py-2 rounded-btn bg-border/50 text-text-secondary/50 text-xs font-medium cursor-not-allowed">
                                                            No disponible
                                                        </button>
                                                    ) : inCart > 0 ? (
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => decrementFromCart(product.id_producto)}
                                                                className="w-8 h-8 rounded-btn border border-border flex items-center justify-center text-text-secondary hover:bg-primary/5 hover:border-primary/40 transition-all"
                                                            >
                                                                <MinusIcon />
                                                            </button>
                                                            <span className="w-8 text-center text-sm font-bold text-primary">{inCart}</span>
                                                            <button
                                                                onClick={() => addToCart(product)}
                                                                disabled={inCart >= product.stock_disponible}
                                                                className="w-8 h-8 rounded-btn bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center shadow-sm hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                                            >
                                                                <PlusIcon />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => addToCart(product)}
                                                            className="flex items-center gap-1.5 px-3 py-2 rounded-btn bg-gradient-to-r from-primary to-secondary text-white text-xs font-medium shadow-sm hover:brightness-110 hover:shadow-md transition-all"
                                                        >
                                                            <PlusIcon />
                                                            Agregar
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="hidden lg:block w-96 flex-shrink-0">
                        <div className="glass-card rounded-card overflow-hidden sticky top-6">
                            <div className="px-5 py-4 border-b border-border/50 flex items-center gap-2">
                                <span className="text-primary"><CartIcon /></span>
                                <h3 className="font-title font-bold text-text-primary">Mi Pedido</h3>
                                {cart.length > 0 && (
                                    <span className="ml-auto text-xs font-bold text-white bg-gradient-to-r from-primary to-secondary px-2 py-0.5 rounded-full">
                                        {cartCount}
                                    </span>
                                )}
                            </div>

                            <div className="px-5 max-h-[400px] overflow-y-auto pt-4">
                                {cart.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-10 text-text-secondary text-sm text-center">
                                        <div className="mb-3 opacity-30"><ShoppingBagIcon /></div>
                                        <p className="text-xs">Agrega productos desde el catalogo</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border/30">
                                        {cart.map((item) => (
                                            <div key={item.id_producto} className="py-3 flex items-start gap-3">
                                                <div className="w-12 h-12 rounded-btn overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 flex-shrink-0">
                                                    {getImageUrl(item.imagen) ? (
                                                        <img src={getImageUrl(item.imagen)} alt={item.nombre} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C9 2 7 4 7 7c0 2.5 2 4 5 4s5-1.5 5-4c0-3-2-5-5-5z" /><path d="M8 11l-3 9h14l-3-9" /></svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-text-primary text-xs truncate">{item.nombre}</p>
                                                    <p className="text-[11px] text-text-secondary">{formatPrice(item.precio)}</p>
                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <button
                                                            onClick={() => decrementFromCart(item.id_producto)}
                                                            className="w-6 h-6 rounded-md border border-border flex items-center justify-center text-text-secondary hover:bg-primary/5 transition-all"
                                                        >
                                                            <MinusIcon />
                                                        </button>
                                                        <span className="text-xs font-bold text-primary w-5 text-center">{item.cantidad}</span>
                                                        <button
                                                            onClick={() => {
                                                                if (item.cantidad < item.stock_disponible) {
                                                                    setCart((prev) => prev.map((ci) => ci.id_producto === item.id_producto ? { ...ci, cantidad: ci.cantidad + 1 } : ci));
                                                                }
                                                            }}
                                                            disabled={item.cantidad >= item.stock_disponible}
                                                            className="w-6 h-6 rounded-md border border-border flex items-center justify-center text-text-secondary hover:bg-primary/5 disabled:opacity-30 transition-all"
                                                        >
                                                            <PlusIcon />
                                                        </button>
                                                        <button
                                                            onClick={() => removeFromCart(item.id_producto)}
                                                            className="ml-auto p-1 rounded-md text-text-secondary hover:text-error hover:bg-error/10 transition-all"
                                                        >
                                                            <TrashIcon />
                                                        </button>
                                                    </div>
                                                </div>
                                                <span className="text-xs font-bold text-text-primary whitespace-nowrap">{formatPrice(item.precio * item.cantidad)}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {cart.length > 0 && (
                                <div className="p-5 border-t border-border/50">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm text-text-secondary">Total</span>
                                        <span className="text-2xl font-title font-bold text-primary">{formatPrice(cartTotal)}</span>
                                    </div>
                                    <button
                                        onClick={handleSubmitOrder}
                                        disabled={submitting}
                                        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-btn btn-gradient text-white font-medium text-sm shadow-md disabled:opacity-70 transition-all"
                                    >
                                        {submitting && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>}
                                        {submitting ? 'Registrando...' : 'Confirmar Pedido'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {tab === 'pedidos' && (
                <div className="glass-card rounded-card overflow-hidden">
                    <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
                        <h3 className="font-title font-bold text-text-primary flex items-center gap-2"><PackageIcon /> Mis Pedidos</h3>
                        <span className="text-xs text-text-secondary">{orders.length} pedidos</span>
                    </div>
                    {loadingOrders ? (
                        <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div></div>
                    ) : orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
                            <div className="mb-4 opacity-30"><PackageIcon /></div>
                            <p className="text-sm">Aun no has realizado pedidos</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border/50 text-left text-xs font-semibold text-text-secondary uppercase">
                                        <th className="px-6 py-4">N°</th>
                                        <th className="px-6 py-4">Fecha</th>
                                        <th className="px-6 py-4">Total</th>
                                        <th className="px-6 py-4">Estado</th>
                                        <th className="px-6 py-4 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.id_pedido} className="border-b border-border/30 hover:bg-primary/5 transition-colors">
                                            <td className="px-6 py-4 font-semibold text-text-primary">#{order.id_pedido}</td>
                                            <td className="px-6 py-4 text-sm text-text-secondary">{formatDate(order.fecha_pedido)}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-primary">{formatPrice(order.total)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(order.estado)}`}>
                                                    {STATUS_OPTIONS.find((s) => s.value === order.estado)?.label || order.estado}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end">
                                                    <button onClick={() => openDetail(order.id_pedido)} className="p-2 rounded-xl text-text-secondary hover:text-secondary hover:bg-secondary/10" title="Ver detalle"><EyeIcon /></button>
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

            {showCart && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden animate-fade-in">
                    <div className="absolute inset-0" onClick={() => setShowCart(false)} />
                    <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm glass-card shadow-2xl animate-slide-up flex flex-col">
                        <div className="px-5 py-4 border-b border-border/50 flex items-center gap-2">
                            <span className="text-primary"><CartIcon /></span>
                            <h3 className="font-title font-bold text-text-primary">Mi Pedido</h3>
                            {cart.length > 0 && (
                                <span className="ml-2 text-xs font-bold text-white bg-gradient-to-r from-primary to-secondary px-2 py-0.5 rounded-full">
                                    {cartCount}
                                </span>
                            )}
                            <button onClick={() => setShowCart(false)} className="ml-auto p-2 rounded-xl hover:bg-primary/10">
                                <CloseIcon />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-5 pt-4">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-text-secondary text-sm text-center">
                                    <div className="mb-3 opacity-30"><ShoppingBagIcon /></div>
                                    <p className="text-xs">Agrega productos desde el catalogo</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border/30">
                                    {cart.map((item) => (
                                        <div key={item.id_producto} className="py-3 flex items-start gap-3">
                                            <div className="w-14 h-14 rounded-btn overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 flex-shrink-0">
                                                {getImageUrl(item.imagen) ? (
                                                    <img src={getImageUrl(item.imagen)} alt={item.nombre} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C9 2 7 4 7 7c0 2.5 2 4 5 4s5-1.5 5-4c0-3-2-5-5-5z" /><path d="M8 11l-3 9h14l-3-9" /></svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-text-primary text-sm truncate">{item.nombre}</p>
                                                <p className="text-xs text-text-secondary">{formatPrice(item.precio)}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <button
                                                        onClick={() => decrementFromCart(item.id_producto)}
                                                        className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-text-secondary hover:bg-primary/5 transition-all"
                                                    >
                                                        <MinusIcon />
                                                    </button>
                                                    <span className="text-sm font-bold text-primary w-6 text-center">{item.cantidad}</span>
                                                    <button
                                                        onClick={() => {
                                                            if (item.cantidad < item.stock_disponible) {
                                                                setCart((prev) => prev.map((ci) => ci.id_producto === item.id_producto ? { ...ci, cantidad: ci.cantidad + 1 } : ci));
                                                            }
                                                        }}
                                                        disabled={item.cantidad >= item.stock_disponible}
                                                        className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-text-secondary hover:bg-primary/5 disabled:opacity-30 transition-all"
                                                    >
                                                        <PlusIcon />
                                                    </button>
                                                    <button
                                                        onClick={() => removeFromCart(item.id_producto)}
                                                        className="ml-auto p-1 rounded-md text-text-secondary hover:text-error hover:bg-error/10 transition-all"
                                                    >
                                                        <TrashIcon />
                                                    </button>
                                                </div>
                                            </div>
                                            <span className="text-sm font-bold text-text-primary whitespace-nowrap">{formatPrice(item.precio * item.cantidad)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-5 border-t border-border/50">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm text-text-secondary">Total</span>
                                    <span className="text-2xl font-title font-bold text-primary">{formatPrice(cartTotal)}</span>
                                </div>
                                <button
                                    onClick={handleSubmitOrder}
                                    disabled={submitting}
                                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-btn btn-gradient text-white font-medium text-sm shadow-md disabled:opacity-70 transition-all"
                                >
                                    {submitting && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>}
                                    {submitting ? 'Registrando...' : 'Confirmar Pedido'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showDetail && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="glass-card rounded-card w-full max-w-lg p-6 animate-scale-in">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-title font-bold text-text-primary flex items-center gap-2"><PackageIcon /> Pedido #{showDetail.id_pedido}</h3>
                            <button onClick={() => setShowDetail(null)} className="p-2 rounded-xl hover:bg-primary/10"><CloseIcon /></button>
                        </div>
                        {detailLoading ? (
                            <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div></div>
                        ) : (
                            <>
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between py-1 border-b border-border/30"><span className="text-sm text-text-secondary">Fecha</span><span className="text-sm font-medium">{formatDate(showDetail.fecha_pedido)}</span></div>
                                    <div className="flex justify-between py-1 border-b border-border/30">
                                        <span className="text-sm text-text-secondary">Estado</span>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(showDetail.estado)}`}>
                                            {STATUS_OPTIONS.find((s) => s.value === showDetail.estado)?.label || showDetail.estado}
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-text-primary mb-2">Productos</h4>
                                    <div className="divide-y divide-border/30">
                                        {showDetail.detalles.map((d) => (
                                            <div key={d.id_detalle_pedido} className="flex items-center justify-between py-2">
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
