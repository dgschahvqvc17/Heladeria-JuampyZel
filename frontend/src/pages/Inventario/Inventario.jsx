import { useState, useEffect, useMemo } from 'react';
import {
    getInventory,
    getLowStock,
    getMovements,
    getMovementById,
    createMovement
} from '../../services/inventoryService';
import { getBranches } from '../../services/branchService';
import { getActiveProducts } from '../../services/productService';

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
);
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
);
const PackageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
);
const AlertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
);
const HistoryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v5h5" /><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" /><path d="M12 7v5l4 2" /></svg>
);

const MOVEMENT_TYPES = [
    { value: 'ENTRADA', label: 'Entrada' },
    { value: 'SALIDA', label: 'Salida' },
    { value: 'AJUSTE', label: 'Ajuste' }
];

const getTipoStyle = (tipo) => {
    switch (tipo) {
        case 'ENTRADA': return 'bg-fresh/10 text-green-700';
        case 'SALIDA': return 'bg-error/10 text-error';
        case 'AJUSTE': return 'bg-accent/10 text-amber-700';
        default: return 'bg-primary/10 text-primary';
    }
};

const EMPTY_FORM = {
    id_producto: '',
    id_sucursal: '',
    tipo: 'ENTRADA',
    cantidad: '',
    motivo: ''
};

export default function Inventario() {
    const [stock, setStock] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [lowStockOnly, setLowStockOnly] = useState(false);

    const [branches, setBranches] = useState([]);
    const [products, setProducts] = useState([]);

    const [movements, setMovements] = useState([]);
    const [movementsLoading, setMovementsLoading] = useState(true);
    const [movementTipo, setMovementTipo] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [showDetail, setShowDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const loadStock = async () => {
        try {
            setLoading(true);
            const response = lowStockOnly ? await getLowStock() : await getInventory();
            setStock(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadMovements = async () => {
        try {
            setMovementsLoading(true);
            const filters = movementTipo ? { tipo: movementTipo } : {};
            const response = await getMovements(filters);
            setMovements(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setMovementsLoading(false);
        }
    };

    useEffect(() => {
        loadStock();
    }, [lowStockOnly]);

    useEffect(() => {
        loadMovements();
    }, [movementTipo]);

    useEffect(() => {
        const loadOptions = async () => {
            try {
                const [branchesResponse, productsResponse] = await Promise.all([getBranches(), getActiveProducts()]);
                setBranches(branchesResponse.data || []);
                setProducts(productsResponse.data || []);
            } catch (err) {
                console.error(err);
            }
        };
        loadOptions();
    }, []);

    const filteredStock = useMemo(() => {
        if (!search.trim()) return stock;
        const term = search.toLowerCase();
        return stock.filter(
            (s) =>
                s.nombre.toLowerCase().includes(term) ||
                (s.descripcion && s.descripcion.toLowerCase().includes(term)) ||
                (s.categoria_nombre && s.categoria_nombre.toLowerCase().includes(term))
        );
    }, [stock, search]);

    const openForm = () => {
        setForm({
            ...EMPTY_FORM,
            id_sucursal: branches[0] ? branches[0].id_sucursal : ''
        });
        setFormError('');
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setForm(EMPTY_FORM);
        setFormError('');
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!form.id_producto) return 'Debe seleccionar un producto.';
        if (!form.id_sucursal) return 'Debe seleccionar una sucursal.';
        if (!form.tipo) return 'Debe seleccionar el tipo de movimiento.';
        if (form.cantidad === '' || form.cantidad === null) return 'La cantidad es obligatoria.';
        const cantidad = Number(form.cantidad);
        if (!Number.isInteger(cantidad) || cantidad <= 0) return 'La cantidad debe ser un número entero mayor a cero.';
        if (form.tipo === 'AJUSTE' && (!form.motivo || form.motivo.trim().length < 2)) return 'Debe indicar el motivo del ajuste.';
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const error = validateForm();
        if (error) { setFormError(error); return; }

        try {
            setSubmitting(true);
            setFormError('');
            await createMovement({
                id_producto: Number(form.id_producto),
                id_sucursal: Number(form.id_sucursal),
                tipo: form.tipo,
                cantidad: Number(form.cantidad),
                motivo: form.tipo === 'AJUSTE' ? form.motivo.trim() : undefined
            });
            closeForm();
            loadStock();
            loadMovements();
        } catch (err) {
            setFormError(err.message || 'Error al registrar el movimiento.');
        } finally {
            setSubmitting(false);
        }
    };

    const openDetail = async (id) => {
        try {
            setDetailLoading(true);
            const response = await getMovementById(id);
            setShowDetail(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setDetailLoading(false);
        }
    };

    const formatDate = (value) => {
        return new Date(value).toLocaleString('es-BO', { dateStyle: 'short', timeStyle: 'short' });
    };

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-title font-bold text-text-primary">Gestionar Inventario</h1>
                    <p className="text-text-secondary text-sm mt-1">Controla el stock de productos y registra movimientos</p>
                </div>
                <button onClick={openForm} className="flex items-center gap-2 px-5 py-2.5 rounded-btn bg-gradient-to-r from-primary to-secondary text-white font-medium text-sm hover:brightness-110 shadow-md">
                    <PlusIcon /> Registrar Movimiento
                </button>
            </div>

            {/* Stock controls */}
            <div className="glass-card rounded-card p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"><SearchIcon /></span>
                        <input
                            type="text"
                            placeholder="Buscar por nombre, descripción o categoría..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-input border border-border bg-white/60 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                        />
                    </div>
                    <button
                        onClick={() => setLowStockOnly((prev) => !prev)}
                        className={`flex items-center justify-center gap-2 px-5 py-3 rounded-input border text-sm font-medium transition-all ${lowStockOnly ? 'bg-error/10 border-error/40 text-error' : 'border-border text-text-secondary hover:bg-primary/5'}`}
                    >
                        <AlertIcon />
                        Solo bajo stock
                    </button>
                </div>
            </div>

            {/* Stock table */}
            <div className="glass-card rounded-card overflow-hidden mb-6">
                <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
                    <h3 className="font-title font-bold text-text-primary flex items-center gap-2"><span className="text-primary"><PackageIcon /></span>Stock actual</h3>
                    <span className="text-xs text-text-secondary">{filteredStock.length} productos</span>
                </div>
                {loading ? (
                    <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div></div>
                ) : filteredStock.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-text-secondary">No se encontraron productos</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/50 text-left text-xs font-semibold text-text-secondary uppercase">
                                    <th className="px-6 py-4">Producto</th>
                                    <th className="px-6 py-4">Categoría</th>
                                    <th className="px-6 py-4">Stock actual</th>
                                    <th className="px-6 py-4">Stock mín.</th>
                                    <th className="px-6 py-4">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStock.map((item) => (
                                    <tr key={item.id_producto} className="border-b border-border/30 hover:bg-primary/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 rounded-xl overflow-hidden bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-lg">🍦</span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-text-primary text-sm">{item.nombre}</p>
                                                    {item.descripcion && <p className="text-xs text-text-secondary truncate max-w-[220px]">{item.descripcion}</p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">{item.categoria_nombre}</span></td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm font-bold ${Number(item.bajo_stock) ? 'text-error' : 'text-primary'}`}>{item.stock_actual}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-text-secondary">{item.stock_minimo}</td>
                                        <td className="px-6 py-4">
                                            {Number(item.bajo_stock) ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-error/10 text-error">
                                                    <AlertIcon /> Bajo stock
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-fresh/10 text-green-700">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                    En stock
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Movements */}
            <div className="glass-card rounded-card overflow-hidden">
                <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
                    <h3 className="font-title font-bold text-text-primary flex items-center gap-2"><span className="text-primary"><HistoryIcon /></span>Historial de movimientos</h3>
                    <select
                        value={movementTipo}
                        onChange={(e) => setMovementTipo(e.target.value)}
                        className="px-3 py-2 rounded-input border border-border bg-white/60 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="">Todos los tipos</option>
                        {MOVEMENT_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                    </select>
                </div>
                {movementsLoading ? (
                    <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div></div>
                ) : movements.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-text-secondary">No se encontraron movimientos</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/50 text-left text-xs font-semibold text-text-secondary uppercase">
                                    <th className="px-6 py-4">N°</th>
                                    <th className="px-6 py-4">Fecha</th>
                                    <th className="px-6 py-4">Producto</th>
                                    <th className="px-6 py-4">Sucursal</th>
                                    <th className="px-6 py-4">Tipo</th>
                                    <th className="px-6 py-4">Cantidad</th>
                                    <th className="px-6 py-4">Usuario</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {movements.map((m) => (
                                    <tr key={m.id_movimiento} className="border-b border-border/30 hover:bg-primary/5 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-text-primary">#{m.id_movimiento}</td>
                                        <td className="px-6 py-4 text-sm text-text-secondary">{formatDate(m.fecha_movimiento)}</td>
                                        <td className="px-6 py-4 text-sm text-text-primary">{m.producto}</td>
                                        <td className="px-6 py-4 text-sm text-text-secondary">{m.sucursal}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getTipoStyle(m.tipo)}`}>
                                                {MOVEMENT_TYPES.find((t) => t.value === m.tipo)?.label || m.tipo}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 text-sm font-bold ${Number(m.cantidad) > 0 ? 'text-green-700' : 'text-error'}`}>
                                            {Number(m.cantidad) > 0 ? `+${m.cantidad}` : m.cantidad}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-text-secondary">{m.usuario}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end">
                                                <button onClick={() => openDetail(m.id_movimiento)} className="p-2 rounded-xl text-text-secondary hover:text-secondary hover:bg-secondary/10" title="Ver detalle"><EyeIcon /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Movement form modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="glass-card rounded-card w-full max-w-lg p-6 animate-scale-in">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-title font-bold text-text-primary">Registrar Movimiento</h3>
                            <button onClick={closeForm} className="p-2 rounded-xl hover:bg-primary/10"><CloseIcon /></button>
                        </div>
                        {formError && <div className="p-3 mb-4 rounded-input bg-error/10 text-error text-sm">{formError}</div>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">Tipo de movimiento *</label>
                                <div className="flex gap-2">
                                    {MOVEMENT_TYPES.map((t) => (
                                        <button
                                            key={t.value}
                                            type="button"
                                            onClick={() => setForm((prev) => ({ ...prev, tipo: t.value }))}
                                            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${form.tipo === t.value ? 'bg-gradient-to-r from-primary/15 to-secondary/15 text-primary' : 'border border-border text-text-secondary hover:bg-primary/5'}`}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">Producto *</label>
                                    <select name="id_producto" value={form.id_producto} onChange={handleFormChange} className="w-full px-4 py-3 rounded-input border border-border bg-white/60 focus:ring-2 focus:ring-primary outline-none">
                                        <option value="">Seleccionar producto...</option>
                                        {products.map((p) => (
                                            <option key={p.id_producto} value={p.id_producto}>{p.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">Sucursal *</label>
                                    <select name="id_sucursal" value={form.id_sucursal} onChange={handleFormChange} className="w-full px-4 py-3 rounded-input border border-border bg-white/60 focus:ring-2 focus:ring-primary outline-none">
                                        <option value="">Seleccionar sucursal...</option>
                                        {branches.filter((b) => b.estado).map((b) => (
                                            <option key={b.id_sucursal} value={b.id_sucursal}>{b.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">Cantidad *</label>
                                <input type="number" name="cantidad" min="1" step="1" value={form.cantidad} onChange={handleFormChange} className="w-full px-4 py-3 rounded-input border border-border bg-white/60 focus:ring-2 focus:ring-primary outline-none" />
                            </div>
                            {form.tipo === 'AJUSTE' && (
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">Motivo del ajuste *</label>
                                    <textarea name="motivo" value={form.motivo} onChange={handleFormChange} rows="3" placeholder="Ej. Conteo físico, merma, quiebre de stock..." className="w-full px-4 py-3 rounded-input border border-border bg-white/60 focus:ring-2 focus:ring-primary outline-none resize-none"></textarea>
                                </div>
                            )}
                            <p className="text-xs text-text-secondary">
                                {form.tipo === 'ENTRADA' && 'La entrada incrementa el stock disponible del producto.'}
                                {form.tipo === 'SALIDA' && 'La salida reduce el stock disponible (no puede superar el stock actual).'}
                                {form.tipo === 'AJUSTE' && 'El ajuste fija el stock al valor indicado y requiere un motivo.'}
                            </p>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={closeForm} className="px-5 py-2.5 rounded-btn border border-border text-text-secondary hover:bg-primary/5 text-sm transition-all">Cancelar</button>
                                <button type="submit" disabled={submitting} className="flex items-center gap-2 px-5 py-2.5 rounded-btn bg-gradient-to-r from-primary to-secondary text-white text-sm shadow-md disabled:opacity-70">
                                    {submitting && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>}
                                    Registrar Movimiento
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Movement detail modal */}
            {showDetail && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="glass-card rounded-card w-full max-w-md p-6 animate-scale-in">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-title font-bold text-text-primary flex items-center gap-2">Movimiento #{showDetail.id_movimiento}</h3>
                            <button onClick={() => setShowDetail(null)} className="p-2 rounded-xl hover:bg-primary/10"><CloseIcon /></button>
                        </div>
                        {detailLoading ? (
                            <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div></div>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex justify-between py-2 border-b border-border/30"><span className="text-sm text-text-secondary">Producto</span><span className="text-sm font-medium text-text-primary">{showDetail.producto}</span></div>
                                <div className="flex justify-between py-2 border-b border-border/30"><span className="text-sm text-text-secondary">Sucursal</span><span className="text-sm font-medium text-text-primary">{showDetail.sucursal}</span></div>
                                <div className="flex justify-between py-2 border-b border-border/30">
                                    <span className="text-sm text-text-secondary">Tipo</span>
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getTipoStyle(showDetail.tipo)}`}>
                                        {MOVEMENT_TYPES.find((t) => t.value === showDetail.tipo)?.label || showDetail.tipo}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-border/30">
                                    <span className="text-sm text-text-secondary">Cantidad</span>
                                    <span className={`text-sm font-bold ${Number(showDetail.cantidad) > 0 ? 'text-green-700' : 'text-error'}`}>
                                        {Number(showDetail.cantidad) > 0 ? `+${showDetail.cantidad}` : showDetail.cantidad}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-border/30"><span className="text-sm text-text-secondary">Stock anterior</span><span className="text-sm font-medium text-text-primary">{showDetail.stock_anterior}</span></div>
                                <div className="flex justify-between py-2 border-b border-border/30"><span className="text-sm text-text-secondary">Stock resultante</span><span className="text-sm font-bold text-primary">{showDetail.stock_resultante}</span></div>
                                <div className="flex justify-between py-2 border-b border-border/30"><span className="text-sm text-text-secondary">Fecha</span><span className="text-sm font-medium text-text-primary">{formatDate(showDetail.fecha_movimiento)}</span></div>
                                <div className="flex justify-between py-2 border-b border-border/30"><span className="text-sm text-text-secondary">Registrado por</span><span className="text-sm font-medium text-text-primary">{showDetail.usuario}</span></div>
                                <div className="flex justify-between py-2"><span className="text-sm text-text-secondary">Motivo</span><span className="text-sm font-medium text-text-primary text-right">{showDetail.motivo || '-'}</span></div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}