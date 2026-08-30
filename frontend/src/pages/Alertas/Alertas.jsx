import { useState, useEffect, useMemo } from 'react';
import { getAlerts, attendAlert } from '../../services/alertService';

// Iconos SVG limpios
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
const AlertTriangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;

export default function Alertas() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('PENDIENTE');
    const [showDetail, setShowDetail] = useState(null);
    const [attending, setAttending] = useState(false);

    const loadAlerts = async () => {
        try {
            setLoading(true);
            const response = await getAlerts();
            setAlerts(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadAlerts(); }, []);

    const filteredAlerts = useMemo(() => {
        let result = alerts;
        if (filter) result = result.filter(a => a.estado === filter);
        if (search.trim()) {
            const term = search.toLowerCase();
            result = result.filter(a => a.producto.toLowerCase().includes(term) || a.sucursal.toLowerCase().includes(term));
        }
        return result;
    }, [alerts, search, filter]);

    const handleAttend = async (id) => {
        if (attending) return;
        try {
            setAttending(true);
            await attendAlert(id);
            if (showDetail && showDetail.id_alerta === id) setShowDetail(null);
            loadAlerts();
        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setAttending(false);
        }
    };

    const formatDate = (dateString) => new Date(dateString).toLocaleString('es-BO', { dateStyle: 'short', timeStyle: 'short' });

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-title font-bold text-text-primary">Alertas de Stock</h1>
                    <p className="text-text-secondary text-sm mt-1">Identifica y gestiona los productos que necesitan reposición</p>
                </div>
            </div>

            <div className="glass-card rounded-card p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"><SearchIcon /></span>
                    <input type="text" placeholder="Buscar producto o sucursal..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-input border border-border bg-white/60 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" />
                </div>
                <select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full px-4 py-3 rounded-input border border-border bg-white/60 focus:ring-2 focus:ring-primary outline-none">
                    <option value="">Todas las alertas</option>
                    <option value="PENDIENTE">Pendientes</option>
                    <option value="ATENDIDA">Atendidas</option>
                </select>
            </div>

            <div className="glass-card rounded-card overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div></div>
                ) : filteredAlerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-text-secondary">No se encontraron alertas</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border/50 text-left text-xs font-semibold text-text-secondary uppercase">
                                    <th className="px-6 py-4">Fecha</th>
                                    <th className="px-6 py-4">Producto</th>
                                    <th className="px-6 py-4">Sucursal</th>
                                    <th className="px-6 py-4">Stock</th>
                                    <th className="px-6 py-4">Estado</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAlerts.map((alert) => (
                                    <tr key={alert.id_alerta} className={`border-b border-border/30 hover:bg-primary/5 transition-colors ${alert.estado === 'PENDIENTE' ? 'bg-error/5' : ''}`}>
                                        <td className="px-6 py-4 text-text-secondary">{formatDate(alert.fecha_generacion)}</td>
                                        <td className="px-6 py-4 font-semibold text-text-primary">{alert.producto}</td>
                                        <td className="px-6 py-4 text-text-secondary">{alert.sucursal}</td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-error">{alert.stock_actual}</span>
                                            <span className="text-text-secondary text-xs ml-1">/ {alert.stock_minimo}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${alert.estado === 'PENDIENTE' ? 'bg-error/10 text-error' : 'bg-fresh/10 text-green-700'}`}>
                                                {alert.estado}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => setShowDetail(alert)} className="p-2 rounded-xl text-text-secondary hover:text-secondary hover:bg-secondary/10" title="Ver detalle"><EyeIcon /></button>
                                                {alert.estado === 'PENDIENTE' && (
                                                    <button onClick={() => handleAttend(alert.id_alerta)} disabled={attending} className="p-2 rounded-xl text-fresh hover:bg-fresh/10 transition-all disabled:opacity-50" title="Marcar como atendida"><CheckIcon /></button>
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

            {/* Modal de Detalle */}
            {showDetail && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="glass-card rounded-card w-full max-w-md p-6 animate-scale-in">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-title font-bold text-text-primary flex items-center gap-2">
                                <AlertTriangleIcon /> Detalle de Alerta
                            </h3>
                            <button onClick={() => setShowDetail(null)} className="p-2 rounded-xl hover:bg-primary/10"><CloseIcon /></button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between py-2 border-b border-border/30"><span className="text-sm text-text-secondary">Producto</span><span className="text-sm font-bold text-primary">{showDetail.producto}</span></div>
                            <div className="flex justify-between py-2 border-b border-border/30"><span className="text-sm text-text-secondary">Sucursal</span><span className="text-sm font-medium">{showDetail.sucursal}</span></div>
                            <div className="flex justify-between py-2 border-b border-border/30"><span className="text-sm text-text-secondary">Stock Actual</span><span className="text-sm font-bold text-error">{showDetail.stock_actual} unidades</span></div>
                            <div className="flex justify-between py-2 border-b border-border/30"><span className="text-sm text-text-secondary">Stock Mínimo (Límite)</span><span className="text-sm font-medium">{showDetail.stock_minimo} unidades</span></div>
                            <div className="flex justify-between py-2 border-b border-border/30"><span className="text-sm text-text-secondary">Fecha Generada</span><span className="text-sm font-medium">{formatDate(showDetail.fecha_generacion)}</span></div>
                            <div className="flex justify-between py-2"><span className="text-sm text-text-secondary">Estado</span><span className={`text-sm font-bold ${showDetail.estado === 'PENDIENTE' ? 'text-error' : 'text-green-600'}`}>{showDetail.estado}</span></div>
                            
                            {showDetail.estado === 'PENDIENTE' && (
                                <button onClick={() => handleAttend(showDetail.id_alerta)} disabled={attending} className="w-full mt-4 flex items-center justify-center gap-2 px-5 py-3 rounded-btn bg-fresh/10 text-green-700 font-medium text-sm hover:bg-fresh/20 transition-all">
                                    <CheckIcon /> Marcar como Atendida
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}