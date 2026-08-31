import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getOrders, getOrderById, updateOrderStatus } from '../../services/orderService';

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const OrderBoxIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>;

const STATUS_OPTS = [
    { value: 'PENDIENTE', label: 'Pendiente' },
    { value: 'CONFIRMADO', label: 'Confirmado' },
    { value: 'PREPARANDO', label: 'Preparando' },
    { value: 'LISTO', label: 'Listo' },
    { value: 'ENTREGADO', label: 'Entregado' },
    { value: 'CANCELADO', label: 'Cancelado' }
];

const getStatusColor = (estado) => {
    switch (estado) {
        case 'PENDIENTE': return 'bg-accent/10 text-amber-700';
        case 'CONFIRMADO': return 'bg-blue-100 text-blue-800';
        case 'PREPARANDO': return 'bg-secondary/10 text-secondary';
        case 'LISTO': return 'bg-primary/10 text-primary';
        case 'ENTREGADO': return 'bg-fresh/10 text-green-700';
        case 'CANCELADO': return 'bg-error/10 text-error';
        default: return 'bg-primary/10 text-primary';
    }
};

export default function Pedidos() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [detailOrder, setDetailOrder] = useState(null);
    const [updating, setUpdating] = useState(false);
    
    // TIENDA no tiene permisos para actualizar, solo consultar.
    const isStore = user?.rol === 'TIENDA';

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await getOrders();
            setOrders(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const filteredOrders = useMemo(() => {
        let result = orders;
        if (filterStatus) result = result.filter(o => o.estado === filterStatus);
        if (search.trim()) {
            const term = search.toLowerCase();
            result = result.filter(o => o.tienda.toLowerCase().includes(term) || String(o.id_pedido).includes(term));
        }
        return result;
    }, [orders, search, filterStatus]);

    const handleViewDetail = async (id) => {
        try {
            const response = await getOrderById(id);
            setDetailOrder(response.data);
        } catch (error) {
            console.error(error);
            alert("No se pudo cargar el detalle del pedido");
        }
    };

    const handleStatusChange = async (newStatus) => {
        if (!detailOrder || updating) return;
        try {
            setUpdating(true);
            await updateOrderStatus(detailOrder.id_pedido, newStatus);
            // Refrescar el detalle y la lista global
            await handleViewDetail(detailOrder.id_pedido);
            await fetchOrders();
        } catch (error) {
            alert(error.message || 'Error al actualizar el estado.');
        } finally {
            setUpdating(false);
        }
    };

    const formatCurrency = (val) => new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(val);
    const formatDate = (val) => new Date(val).toLocaleString('es-BO', { dateStyle: 'short', timeStyle: 'short' });

    // Lógica para botones de siguiente estado (solo si no es tienda)
    const renderActionButtons = () => {
        if (isStore) return null;
        const current = detailOrder.estado;
        return (
            <div className="flex gap-2 flex-wrap">
                {current === 'PENDIENTE' && (
                    <>
                        <button disabled={updating} onClick={() => handleStatusChange('CONFIRMADO')} className="px-4 py-2 rounded-btn bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium shadow-md hover:brightness-110">Confirmar Pedido</button>
                        <button disabled={updating} onClick={() => handleStatusChange('CANCELADO')} className="px-4 py-2 rounded-btn bg-error/10 text-error text-sm font-medium hover:bg-error/20">Cancelar Pedido</button>
                    </>
                )}
                {current === 'CONFIRMADO' && (
                    <button disabled={updating} onClick={() => handleStatusChange('PREPARANDO')} className="px-4 py-2 rounded-btn bg-secondary/10 text-secondary text-sm font-medium hover:bg-secondary/20">Pasar a Preparando</button>
                )}
                {current === 'PREPARANDO' && (
                    <button disabled={updating} onClick={() => handleStatusChange('LISTO')} className="px-4 py-2 rounded-btn bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20">Marcar como Listo</button>
                )}
                {current === 'LISTO' && (
                    <button disabled={updating} onClick={() => handleStatusChange('ENTREGADO')} className="px-4 py-2 rounded-btn bg-fresh/10 text-green-700 text-sm font-medium hover:bg-fresh/20">Marcar como Entregado</button>
                )}
            </div>
        );
    };

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-title font-bold text-text-primary">{isStore ? 'Mis Pedidos' : 'Gestionar Pedidos'}</h1>
                    <p className="text-text-secondary text-sm mt-1">{isStore ? 'Revisa el avance de tus solicitudes de abastecimiento' : 'Administra los pedidos realizados por las tiendas'}</p>
                </div>
            </div>

            <div className="glass-card rounded-card p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"><SearchIcon /></span>
                    <input type="text" placeholder="Buscar por N° de pedido o tienda..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-input border border-border bg-white/60 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" />
                </div>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full px-4 py-3 rounded-input border border-border bg-white/60 focus:ring-2 focus:ring-primary outline-none">
                    <option value="">Todos los estados</option>
                    {STATUS_OPTS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
            </div>

            <div className="glass-card rounded-card overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div></div>
                ) : filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-text-secondary">No se encontraron pedidos.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border/50 text-left text-xs font-semibold text-text-secondary uppercase">
                                    <th className="px-6 py-4">N° Pedido</th>
                                    <th className="px-6 py-4">Fecha</th>
                                    {!isStore && <th className="px-6 py-4">Tienda</th>}
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4">Estado</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map(order => (
                                    <tr key={order.id_pedido} className="border-b border-border/30 hover:bg-primary/5 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-text-primary">#{order.id_pedido}</td>
                                        <td className="px-6 py-4 text-text-secondary">{formatDate(order.fecha_pedido)}</td>
                                        {!isStore && <td className="px-6 py-4 text-text-primary font-medium">{order.tienda}</td>}
                                        <td className="px-6 py-4 font-bold text-primary">{formatCurrency(order.total)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(order.estado)}`}>
                                                {order.estado}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end">
                                                <button onClick={() => handleViewDetail(order.id_pedido)} className="p-2 rounded-xl text-text-secondary hover:text-secondary hover:bg-secondary/10" title="Ver detalle">
                                                    <EyeIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal de Detalle con Historial */}
            {detailOrder && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="glass-card rounded-card w-full max-w-3xl flex flex-col max-h-[90vh] animate-scale-in">
                        <div className="p-6 border-b border-border/50 flex items-center justify-between">
                            <h3 className="text-lg font-title font-bold text-text-primary flex items-center gap-2">
                                <OrderBoxIcon /> Pedido #{detailOrder.id_pedido}
                            </h3>
                            <button onClick={() => setDetailOrder(null)} className="p-2 rounded-xl hover:bg-primary/10"><CloseIcon /></button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Columna Izquierda: Datos y Productos */}
                            <div>
                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between py-1 border-b border-border/30"><span className="text-sm text-text-secondary">Tienda</span><span className="text-sm font-bold text-text-primary">{detailOrder.tienda}</span></div>
                                    <div className="flex justify-between py-1 border-b border-border/30"><span className="text-sm text-text-secondary">Fecha</span><span className="text-sm font-medium">{formatDate(detailOrder.fecha_pedido)}</span></div>
                                    <div className="flex justify-between py-1 border-b border-border/30"><span className="text-sm text-text-secondary">Total</span><span className="text-sm font-bold text-primary">{formatCurrency(detailOrder.total)}</span></div>
                                    <div className="flex justify-between py-1 border-b border-border/30">
                                        <span className="text-sm text-text-secondary">Estado Actual</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${getStatusColor(detailOrder.estado)}`}>{detailOrder.estado}</span>
                                    </div>
                                </div>
                                <h4 className="text-sm font-bold text-text-primary mb-3">Productos Solicitados</h4>
                                <div className="divide-y divide-border/30 bg-white/40 rounded-lg p-3 border border-border">
                                    {detailOrder.detalles.map(d => (
                                        <div key={d.id_detalle_pedido} className="flex justify-between py-2 text-sm">
                                            <div>
                                                <p className="font-semibold text-text-primary">{d.producto}</p>
                                                <p className="text-xs text-text-secondary">{formatCurrency(d.precio_unitario)} x {d.cantidad}</p>
                                            </div>
                                            <span className="font-bold text-text-primary">{formatCurrency(d.subtotal)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Columna Derecha: Línea de tiempo (Historial) */}
                            <div>
                                <h4 className="text-sm font-bold text-text-primary mb-4">Línea de Tiempo</h4>
                                <div className="space-y-4">
                                    {detailOrder.historial && detailOrder.historial.map((hist, idx) => (
                                        <div key={hist.id_historial} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-secondary mt-1"></div>
                                                {idx !== detailOrder.historial.length - 1 && <div className="flex-1 w-px bg-border my-1"></div>}
                                            </div>
                                            <div className="pb-4">
                                                <p className="text-sm font-bold text-text-primary">Estado: {hist.estado_nuevo}</p>
                                                <p className="text-xs text-text-secondary">{formatDate(hist.fecha_cambio)}</p>
                                                <p className="text-xs text-text-secondary/60 mt-0.5">Gestor: {hist.usuario}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {(!detailOrder.historial || detailOrder.historial.length === 0) && (
                                        <p className="text-sm text-text-secondary">No hay historial registrado.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer (Botones de Acción) */}
                        <div className="p-6 border-t border-border/50 bg-white/50 flex items-center justify-between">
                            <span className="text-sm text-text-secondary">Acciones de gestión de pedido</span>
                            {renderActionButtons()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}