import { useState, useEffect, useMemo } from 'react';
import { getOrders, getOrderById, updateOrderStatus } from '../../services/orderService';

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
);
const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
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

export default function Pedidos() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [updatingId, setUpdatingId] = useState(null);
    const [showDetail, setShowDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');

    const loadOrders = async () => {
        try {
            setLoading(true);
            const response = await getOrders();
            setOrders(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const filteredOrders = useMemo(() => {
        let list = orders;
        if (statusFilter) list = list.filter((o) => o.estado === statusFilter);
        if (search.trim()) {
            const term = search.toLowerCase();
            list = list.filter(
                (o) =>
                    o.tienda.toLowerCase().includes(term) ||
                    String(o.id_pedido).includes(term)
            );
        }
        return list;
    }, [orders, search, statusFilter]);

    const handleStatusChange = async (order, estado) => {
        try {
            setUpdatingId(order.id_pedido);
            await updateOrderStatus(order.id_pedido, estado);
            setOrders((prev) =>
                prev.map((o) => (o.id_pedido === order.id_pedido ? { ...o, estado } : o))
            );
        } catch (err) {
            console.error(err);
            alert(err.message || 'Error al actualizar el estado del pedido.');
        } finally {
            setUpdatingId(null);
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
                    <h1 className="text-2xl font-title font-bold text-text-primary">Gestionar Pedidos</h1>
                    <p className="text-text-secondary text-sm mt-1">Administra los pedidos realizados por las tiendas</p>
                </div>
            </div>

            <div className="glass-card rounded-card p-4 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"><SearchIcon /></span>
                        <input
                            type="text"
                            placeholder="Buscar por tienda o N° de pedido..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-input border border-border bg-white/60 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
                        />
                    </div>
                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-4 py-3 rounded-input border border-border bg-white/60 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
                        >
                            <option value="">Todos los estados</option>
                            {STATUS_OPTIONS.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="glass-card rounded-card overflow-hidden">
                <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
                    <h3 className="font-title font-bold text-text-primary flex items-center gap-2"><span className="text-primary"><CartIcon /></span>Pedidos</h3>
                    <span className="text-xs text-text-secondary">{filteredOrders.length} pedidos</span>
                </div>
                {loading ? (
                    <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div></div>
                ) : filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-text-secondary">No se encontraron pedidos</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/50 text-left text-xs font-semibold text-text-secondary uppercase">
                                    <th className="px-6 py-4">N°</th>
                                    <th className="px-6 py-4">Fecha</th>
                                    <th className="px-6 py-4">Tienda</th>
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4">Estado</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => (
                                    <tr key={order.id_pedido} className="border-b border-border/30 hover:bg-primary/5 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-text-primary">#{order.id_pedido}</td>
                                        <td className="px-6 py-4 text-sm text-text-secondary">{formatDate(order.fecha_pedido)}</td>
                                        <td className="px-6 py-4 text-sm text-text-secondary">{order.tienda}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-primary">{formatPrice(order.total)}</td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={order.estado}
                                                disabled={updatingId === order.id_pedido}
                                                onChange={(e) => handleStatusChange(order, e.target.value)}
                                                className={`px-2 py-1.5 rounded-full text-xs font-medium border-0 outline-none cursor-pointer ${getStatusStyle(order.estado)}`}
                                            >
                                                {STATUS_OPTIONS.map((s) => (
                                                    <option key={s.value} value={s.value}>{s.label}</option>
                                                ))}
                                            </select>
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

            {showDetail && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="glass-card rounded-card w-full max-w-lg p-6 animate-scale-in">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-title font-bold text-text-primary flex items-center gap-2"><CartIcon /> Pedido #{showDetail.id_pedido}</h3>
                            <button onClick={() => setShowDetail(null)} className="p-2 rounded-xl hover:bg-primary/10"><CloseIcon /></button>
                        </div>
                        {detailLoading ? (
                            <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div></div>
                        ) : (
                            <>
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between py-1 border-b border-border/30"><span className="text-sm text-text-secondary">Tienda</span><span className="text-sm font-medium">{showDetail.tienda}</span></div>
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
