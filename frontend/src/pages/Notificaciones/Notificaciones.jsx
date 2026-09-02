import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotifications } from '../../services/orderService';

const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
);
const PackageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
);
const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
);

const STATUS_LABELS = {
    PENDIENTE: 'Pendiente',
    CONFIRMADO: 'Confirmado',
    PREPARANDO: 'Preparando',
    LISTO: 'Listo',
    ENTREGADO: 'Entregado',
    CANCELADO: 'Cancelado'
};

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

export default function Notificaciones() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const response = await getNotifications();
            setNotifications(response.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const formatDate = (value) => {
        return new Date(value).toLocaleString('es-BO', { dateStyle: 'short', timeStyle: 'short' });
    };

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-title font-bold text-text-primary">Notificaciones</h1>
                    <p className="text-text-secondary text-sm mt-1">Cambios de estado de tus pedidos</p>
                </div>
                <button
                    onClick={loadNotifications}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-btn bg-gradient-to-r from-primary to-secondary text-white font-medium text-sm shadow-md hover:brightness-110 transition-all"
                >
                    <RefreshIcon /> Actualizar
                </button>
            </div>

            <div className="glass-card rounded-card overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div></div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
                        <div className="mb-4 opacity-30"><BellIcon /></div>
                        <p className="text-sm">Aun no tienes notificaciones</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border/30">
                        {notifications.map((n) => (
                            <button
                                key={n.id_notificacion}
                                onClick={() => navigate('/tienda', { state: { openTab: 'pedidos' } })}
                                className="w-full flex items-start gap-4 px-5 py-4 text-left hover:bg-primary/5 transition-colors"
                            >
                                <span className="p-2.5 rounded-xl bg-primary/10 text-primary flex-shrink-0">
                                    <PackageIcon />
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-text-primary">
                                        <span className="font-semibold">Pedido #{n.id_pedido}</span>
                                        {(n.estado_anterior && n.estado_anterior !== n.estado_nuevo) ? (
                                            <>
                                                {' '}cambió de{' '}
                                                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(n.estado_anterior)}`}>
                                                    {STATUS_LABELS[n.estado_anterior] || n.estado_anterior}
                                                </span>
                                                {' '}a{' '}
                                            </>
                                        ) : (
                                            <> fue registrado como </>
                                        )}
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(n.estado_nuevo)}`}>
                                            {STATUS_LABELS[n.estado_nuevo] || n.estado_nuevo}
                                        </span>
                                    </p>
                                    <p className="text-xs text-text-secondary mt-1">{formatDate(n.fecha_cambio)}</p>
                                </div>
                                <span className="text-text-secondary text-xs flex-shrink-0">Ver</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}