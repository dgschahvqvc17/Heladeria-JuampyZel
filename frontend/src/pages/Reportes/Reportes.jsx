import { useState, useEffect, useMemo } from 'react';
import {
    getSalesReport,
    getOrdersReport,
    getProductsReport,
    getInventoryReport
} from '../../services/reportService';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);
const DollarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
);
const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
);
const BoxIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
);
const PackageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
);
const FileTextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
);
const ExcelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M9 13l6 6" /><path d="M15 13l-6 6" /></svg>
);

const ORDER_STATES = ['PENDIENTE', 'CONFIRMADO', 'PREPARANDO', 'LISTO', 'ENTREGADO', 'CANCELADO'];

const CHART_COLORS = ['#FF6B9A', '#7C5CFC', '#FFD166', '#6DD6A0', '#6EA8FE', '#FF6B6B', '#E85588', '#6A4DE0'];

const getEstadoStyle = (estado) => {
    switch (estado) {
        case 'PENDIENTE': return 'bg-accent/10 text-amber-700';
        case 'CONFIRMADO': return 'bg-primary/10 text-primary';
        case 'PREPARANDO': return 'bg-secondary/10 text-secondary';
        case 'LISTO': return 'bg-info/10 text-blue-700';
        case 'ENTREGADO': return 'bg-fresh/10 text-green-700';
        case 'CANCELADO': return 'bg-error/10 text-error';
        default: return 'bg-primary/10 text-primary';
    }
};

const REPORT_TABS = [
    { key: 'ventas', label: 'Ventas', icon: DollarIcon },
    { key: 'pedidos', label: 'Pedidos', icon: CartIcon },
    { key: 'productos', label: 'Productos', icon: BoxIcon },
    { key: 'inventario', label: 'Inventario', icon: PackageIcon }
];

export default function Reportes() {
    const [activeTab, setActiveTab] = useState('ventas');

    const [sales, setSales] = useState({ sales: [], summary: null });
    const [orders, setOrders] = useState({ orders: [], summary: null });
    const [products, setProducts] = useState({ products: [], summary: null });
    const [inventory, setInventory] = useState({ movements: [], summary: null });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [estado, setEstado] = useState('');

    const formatPrice = (value) => {
        return new Intl.NumberFormat('es-BO', {
            style: 'currency',
            currency: 'BOB'
        }).format(Number(value) || 0);
    };

    const formatDate = (value) => {
        if (!value) return '-';
        return new Date(value).toLocaleString('es-BO', { dateStyle: 'short', timeStyle: 'short' });
    };

    const loadSales = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getSalesReport({ dateFrom, dateTo });
            setSales(data);
        } catch (err) {
            setError(err.message || 'Error al obtener el reporte de ventas.');
        } finally {
            setLoading(false);
        }
    };

    const loadOrders = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getOrdersReport({ dateFrom, dateTo, estado });
            setOrders(data);
        } catch (err) {
            setError(err.message || 'Error al obtener el reporte de pedidos.');
        } finally {
            setLoading(false);
        }
    };

    const loadProducts = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getProductsReport();
            setProducts(data);
        } catch (err) {
            setError(err.message || 'Error al obtener el reporte de productos.');
        } finally {
            setLoading(false);
        }
    };

    const loadInventory = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getInventoryReport({ dateFrom, dateTo });
            setInventory(data);
        } catch (err) {
            setError(err.message || 'Error al obtener el reporte de inventario.');
        } finally {
            setLoading(false);
        }
    };

    const loadTab = (tab) => {
        if (tab === 'ventas') loadSales();
        if (tab === 'pedidos') loadOrders();
        if (tab === 'productos') loadProducts();
        if (tab === 'inventario') loadInventory();
    };

    useEffect(() => {
        loadTab(activeTab);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    const applyFilters = () => {
        loadTab(activeTab);
    };

    const resetFilters = () => {
        setDateFrom('');
        setDateTo('');
        setEstado('');
        setTimeout(() => loadTab(activeTab), 0);
    };

    // ---- Export helpers ----
    const exportToExcel = (rows, sheetName, fileName) => {
        if (!rows || rows.length === 0) {
            setError('No hay datos para exportar.');
            return;
        }
        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        XLSX.writeFile(workbook, fileName);
    };

    const exportSalesExcel = () => {
        const rows = sales.sales.map((s) => ({
            'N°': s.id_venta,
            'Fecha': formatDate(s.fecha_venta),
            'Sucursal': s.sucursal,
            'Vendedor': s.usuario,
            'Cliente': s.cliente || '-',
            'Total (Bs)': s.total
        }));
        exportToExcel(rows, 'Ventas', 'reporte_ventas.xlsx');
    };

    const exportOrdersExcel = () => {
        const rows = orders.orders.map((o) => ({
            'N°': o.id_pedido,
            'Fecha': formatDate(o.fecha_pedido),
            'Tienda': o.tienda,
            'Estado': o.estado,
            'Total (Bs)': o.total
        }));
        exportToExcel(rows, 'Pedidos', 'reporte_pedidos.xlsx');
    };

    const exportProductsExcel = () => {
        const rows = products.products.map((p) => ({
            'Producto': p.nombre,
            'Categoría': p.categoria,
            'Precio (Bs)': p.precio,
            'Stock total': p.stock_total,
            'Stock mín.': p.stock_minimo,
            'Estado': Number(p.estado) ? 'Activo' : 'Inactivo',
            'Bajo stock': Number(p.bajo_stock) ? 'Sí' : 'No'
        }));
        exportToExcel(rows, 'Productos', 'reporte_productos.xlsx');
    };

    const exportInventoryExcel = () => {
        const rows = inventory.movements.map((m) => ({
            'N°': m.id_movimiento,
            'Fecha': formatDate(m.fecha_movimiento),
            'Producto': m.producto,
            'Sucursal': m.sucursal,
            'Tipo': m.tipo,
            'Cantidad': m.cantidad,
            'Stock anterior': m.stock_anterior,
            'Stock resultante': m.stock_resultante,
            'Usuario': m.usuario
        }));
        exportToExcel(rows, 'Movimientos', 'reporte_inventario.xlsx');
    };

    const exportToPDF = (title, headers, body, fileName) => {
        if (!body || body.length === 0) {
            setError('No hay datos para exportar.');
            return;
        }
        const doc = new jsPDF({ orientation: 'landscape' });
        doc.setFontSize(16);
        doc.setTextColor(37, 34, 53);
        doc.text(`JuampyZel - ${title}`, 14, 16);
        doc.setFontSize(10);
        doc.setTextColor(111, 107, 125);
        doc.text(`Generado el ${new Date().toLocaleString('es-BO')}`, 14, 22);

        autoTable(doc, {
            startY: 28,
            head: [headers],
            body,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [255, 107, 154] }
        });

        doc.save(fileName);
    };

    const exportSalesPDF = () => {
        exportToPDF(
            'Reporte de Ventas',
            ['N°', 'Fecha', 'Sucursal', 'Vendedor', 'Cliente', 'Total (Bs)'],
            sales.sales.map((s) => [s.id_venta, formatDate(s.fecha_venta), s.sucursal, s.usuario, s.cliente || '-', s.total]),
            'reporte_ventas.pdf'
        );
    };

    const exportOrdersPDF = () => {
        exportToPDF(
            'Reporte de Pedidos',
            ['N°', 'Fecha', 'Tienda', 'Estado', 'Total (Bs)'],
            orders.orders.map((o) => [o.id_pedido, formatDate(o.fecha_pedido), o.tienda, o.estado, o.total]),
            'reporte_pedidos.pdf'
        );
    };

    const exportProductsPDF = () => {
        exportToPDF(
            'Reporte de Productos',
            ['Producto', 'Categoría', 'Precio (Bs)', 'Stock total', 'Stock mín.', 'Bajo stock'],
            products.products.map((p) => [p.nombre, p.categoria, p.precio, p.stock_total, p.stock_minimo, Number(p.bajo_stock) ? 'Sí' : 'No']),
            'reporte_productos.pdf'
        );
    };

    const exportInventoryPDF = () => {
        exportToPDF(
            'Reporte de Inventario',
            ['N°', 'Fecha', 'Producto', 'Sucursal', 'Tipo', 'Cantidad', 'Stock ant.', 'Stock res.'],
            inventory.movements.map((m) => [m.id_movimiento, formatDate(m.fecha_movimiento), m.producto, m.sucursal, m.tipo, m.cantidad, m.stock_anterior, m.stock_resultante]),
            'reporte_inventario.pdf'
        );
    };

    const summaryCards = useMemo(() => {
        if (activeTab === 'ventas' && sales.summary) {
            return [
                { label: 'Ventas registradas', value: sales.summary.totals.total_ventas, icon: CartIcon, color: 'text-primary' },
                { label: 'Ingresos totales', value: formatPrice(sales.summary.totals.total_ingresos), icon: DollarIcon, color: 'text-fresh' }
            ];
        }
        if (activeTab === 'pedidos' && orders.summary) {
            return [
                { label: 'Pedidos realizados', value: orders.summary.totals.total_pedidos, icon: CartIcon, color: 'text-primary' },
                { label: 'Monto total pedidos', value: formatPrice(orders.summary.totals.total_pedidos_monto), icon: DollarIcon, color: 'text-secondary' }
            ];
        }
        if (activeTab === 'productos' && products.summary) {
            return [
                { label: 'Productos registrados', value: products.summary.totals.total_productos, icon: BoxIcon, color: 'text-primary' },
                { label: 'Activos', value: `${products.summary.totals.productos_activos} de ${products.summary.totals.total_productos}`, icon: PackageIcon, color: 'text-fresh' },
                { label: 'En bajo stock', value: products.summary.lowStock.length, icon: PackageIcon, color: 'text-error' }
            ];
        }
        if (activeTab === 'inventario' && inventory.summary) {
            return [
                { label: 'Movimientos', value: inventory.summary.totals.total_movimientos, icon: PackageIcon, color: 'text-primary' },
                { label: 'Entradas / Salidas', value: `${inventory.summary.totals.entradas} / ${inventory.summary.totals.salidas}`, icon: PackageIcon, color: 'text-fresh' },
                { label: 'Unidades en stock', value: inventory.summary.stock.unidades_totales, icon: BoxIcon, color: 'text-secondary' }
            ];
        }
        return [];
    }, [activeTab, sales, orders, products, inventory]);

    const renderChart = (data, label) => {
        const filtered = (data || []).filter((d) => d.value > 0);
        if (filtered.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-16 text-text-secondary text-sm">
                    No hay datos para mostrar en la gráfica.
                </div>
            );
        }
        return (
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={filtered}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={90}
                            label={(entry) => entry.name}
                        >
                            {filtered.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value} ${label}`} />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        );
    };

    const renderVentas = () => (
        <div className="space-y-6">
            {sales.summary && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="glass-card rounded-card p-5">
                        <h4 className="text-sm font-semibold text-text-primary mb-3">Ventas por sucursal</h4>
                        {renderChart(sales.summary.byBranch, 'ventas')}
                    </div>
                    <div className="glass-card rounded-card p-5">
                        <h4 className="text-sm font-semibold text-text-primary mb-3">Productos más vendidos</h4>
                        {renderChart(sales.summary.byProduct, 'unidades')}
                    </div>
                </div>
            )}

            <div className="glass-card rounded-card overflow-hidden">
                <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
                    <h3 className="font-title font-bold text-text-primary">Detalle de Ventas</h3>
                    <span className="text-xs text-text-secondary">{sales.sales.length} registros</span>
                </div>
                {loading ? (
                    <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div></div>
                ) : sales.sales.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-text-secondary">No se encontraron ventas para el período.</div>
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
                                    <th className="px-6 py-4 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sales.sales.map((s) => (
                                    <tr key={s.id_venta} className="border-b border-border/30 hover:bg-primary/5 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-text-primary">#{s.id_venta}</td>
                                        <td className="px-6 py-4 text-sm text-text-secondary">{formatDate(s.fecha_venta)}</td>
                                        <td className="px-6 py-4 text-sm text-text-secondary">{s.sucursal}</td>
                                        <td className="px-6 py-4 text-sm text-text-secondary">{s.usuario}</td>
                                        <td className="px-6 py-4 text-sm text-text-secondary">{s.cliente || '-'}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-primary text-right">{formatPrice(s.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );

    const renderPedidos = () => (
        <div className="space-y-6">
            {orders.summary && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="glass-card rounded-card p-5">
                        <h4 className="text-sm font-semibold text-text-primary mb-3">Pedidos por estado</h4>
                        {renderChart(orders.summary.byEstado, 'pedidos')}
                    </div>
                    <div className="glass-card rounded-card p-5">
                        <h4 className="text-sm font-semibold text-text-primary mb-3">Pedidos por tienda</h4>
                        {renderChart(orders.summary.byTienda, 'pedidos')}
                    </div>
                </div>
            )}

            <div className="glass-card rounded-card overflow-hidden">
                <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
                    <h3 className="font-title font-bold text-text-primary">Detalle de Pedidos</h3>
                    <span className="text-xs text-text-secondary">{orders.orders.length} registros</span>
                </div>
                {loading ? (
                    <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div></div>
                ) : orders.orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-text-secondary">No se encontraron pedidos.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/50 text-left text-xs font-semibold text-text-secondary uppercase">
                                    <th className="px-6 py-4">N°</th>
                                    <th className="px-6 py-4">Fecha</th>
                                    <th className="px-6 py-4">Tienda</th>
                                    <th className="px-6 py-4">Estado</th>
                                    <th className="px-6 py-4 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.orders.map((o) => (
                                    <tr key={o.id_pedido} className="border-b border-border/30 hover:bg-primary/5 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-text-primary">#{o.id_pedido}</td>
                                        <td className="px-6 py-4 text-sm text-text-secondary">{formatDate(o.fecha_pedido)}</td>
                                        <td className="px-6 py-4 text-sm text-text-secondary">{o.tienda}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getEstadoStyle(o.estado)}`}>{o.estado}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-primary text-right">{formatPrice(o.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );

    const renderProductos = () => (
        <div className="space-y-6">
            {products.summary && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="glass-card rounded-card p-5">
                        <h4 className="text-sm font-semibold text-text-primary mb-3">Productos por categoría</h4>
                        {renderChart(products.summary.byCategory, 'productos')}
                    </div>
                    <div className="glass-card rounded-card p-5">
                        <h4 className="text-sm font-semibold text-text-primary mb-3">Productos con bajo stock</h4>
                        {products.summary.lowStock.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-fresh text-sm">No hay productos con bajo stock.</div>
                        ) : (
                            <div className="max-h-72 overflow-y-auto divide-y divide-border/30">
                                {products.summary.lowStock.map((p) => (
                                    <div key={p.id_producto} className="py-3 flex items-center justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="font-medium text-text-primary text-sm truncate">{p.nombre}</p>
                                            <p className="text-xs text-text-secondary">Mínimo: {p.stock_minimo}</p>
                                        </div>
                                        <span className="text-sm font-bold text-error flex-shrink-0">{p.stock_total} unid.</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="glass-card rounded-card overflow-hidden">
                <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
                    <h3 className="font-title font-bold text-text-primary">Catálogo de Productos</h3>
                    <span className="text-xs text-text-secondary">{products.products.length} registros</span>
                </div>
                {loading ? (
                    <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div></div>
                ) : products.products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-text-secondary">No hay productos registrados.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/50 text-left text-xs font-semibold text-text-secondary uppercase">
                                    <th className="px-6 py-4">Producto</th>
                                    <th className="px-6 py-4">Categoría</th>
                                    <th className="px-6 py-4 text-right">Precio</th>
                                    <th className="px-6 py-4 text-right">Stock</th>
                                    <th className="px-6 py-4">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.products.map((p) => (
                                    <tr key={p.id_producto} className="border-b border-border/30 hover:bg-primary/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-text-primary text-sm">{p.nombre}</p>
                                            {p.descripcion && <p className="text-xs text-text-secondary truncate max-w-[240px]">{p.descripcion}</p>}
                                        </td>
                                        <td className="px-6 py-4"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">{p.categoria}</span></td>
                                        <td className="px-6 py-4 text-sm font-bold text-primary text-right">{formatPrice(p.precio)}</td>
                                        <td className="px-6 py-4 text-sm text-text-secondary text-right">{p.stock_total}</td>
                                        <td className="px-6 py-4">
                                            {Number(p.bajo_stock) ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-error/10 text-error">Bajo stock</span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-fresh/10 text-green-700">{Number(p.estado) ? 'Activo' : 'Inactivo'}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );

    const renderInventario = () => (
        <div className="space-y-6">
            {inventory.summary && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="glass-card rounded-card p-5">
                        <h4 className="text-sm font-semibold text-text-primary mb-3">Movimientos por tipo</h4>
                        {renderChart(inventory.summary.byTipo, 'movimientos')}
                    </div>
                    <div className="glass-card rounded-card p-5">
                        <h4 className="text-sm font-semibold text-text-primary mb-3">Resumen de inventario</h4>
                        <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-fresh/10">
                                <span className="text-sm text-text-secondary">Productos con stock</span>
                                <span className="text-lg font-bold text-fresh">{inventory.summary.stock.productos_con_stock}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-primary/10">
                                <span className="text-sm text-text-secondary">Unidades totales</span>
                                <span className="text-lg font-bold text-primary">{inventory.summary.stock.unidades_totales}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/10">
                                <span className="text-sm text-text-secondary">Entradas</span>
                                <span className="text-lg font-bold text-secondary">{inventory.summary.totals.entradas}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-error/10">
                                <span className="text-sm text-text-secondary">Salidas</span>
                                <span className="text-lg font-bold text-error">{inventory.summary.totals.salidas}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="glass-card rounded-card overflow-hidden">
                <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
                    <h3 className="font-title font-bold text-text-primary">Movimientos de inventario</h3>
                    <span className="text-xs text-text-secondary">{inventory.movements.length} registros</span>
                </div>
                {loading ? (
                    <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div></div>
                ) : inventory.movements.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-text-secondary">No se encontraron movimientos.</div>
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
                                    <th className="px-6 py-4 text-right">Cantidad</th>
                                    <th className="px-6 py-4 text-right">Stock result.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventory.movements.map((m) => (
                                    <tr key={m.id_movimiento} className="border-b border-border/30 hover:bg-primary/5 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-text-primary">#{m.id_movimiento}</td>
                                        <td className="px-6 py-4 text-sm text-text-secondary">{formatDate(m.fecha_movimiento)}</td>
                                        <td className="px-6 py-4 text-sm text-text-primary">{m.producto}</td>
                                        <td className="px-6 py-4 text-sm text-text-secondary">{m.sucursal}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${m.tipo === 'ENTRADA' ? 'bg-fresh/10 text-green-700' : m.tipo === 'SALIDA' ? 'bg-error/10 text-error' : 'bg-accent/10 text-amber-700'}`}>{m.tipo}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-text-primary text-right">{m.cantidad}</td>
                                        <td className="px-6 py-4 text-sm text-text-secondary text-right">{m.stock_resultante}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );

    const renderExportButtons = () => (
        <div className="flex items-center gap-2">
            <button
                onClick={() => { if (activeTab === 'ventas') exportSalesPDF(); if (activeTab === 'pedidos') exportOrdersPDF(); if (activeTab === 'productos') exportProductsPDF(); if (activeTab === 'inventario') exportInventoryPDF(); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-btn border border-border text-text-secondary hover:text-primary hover:bg-primary/5 text-sm font-medium transition-all"
                title="Exportar a PDF"
            >
                <FileTextIcon /> PDF
            </button>
            <button
                onClick={() => { if (activeTab === 'ventas') exportSalesExcel(); if (activeTab === 'pedidos') exportOrdersExcel(); if (activeTab === 'productos') exportProductsExcel(); if (activeTab === 'inventario') exportInventoryExcel(); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-btn border border-border text-text-secondary hover:text-fresh hover:bg-fresh/10 text-sm font-medium transition-all"
                title="Exportar a Excel"
            >
                <ExcelIcon /> Excel
            </button>
        </div>
    );

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-title font-bold text-text-primary">Reportes</h1>
                    <p className="text-text-secondary text-sm mt-1">Consulta y exporta la información de las operaciones de JuampyZel</p>
                </div>
                {renderExportButtons()}
            </div>

            {error && <div className="p-3 mb-4 rounded-input bg-error/10 border border-error text-error text-sm">{error}</div>}

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {REPORT_TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md' : 'glass-card text-text-secondary hover:text-primary'}`}
                    >
                        <tab.icon />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div className="glass-card rounded-card p-4 mb-6">
                <div className="flex flex-col lg:flex-row gap-3 items-end">
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-text-secondary mb-1">Desde</label>
                        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full px-3 py-2.5 rounded-input border border-border bg-white/60 focus:ring-2 focus:ring-primary outline-none text-sm" />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-text-secondary mb-1">Hasta</label>
                        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full px-3 py-2.5 rounded-input border border-border bg-white/60 focus:ring-2 focus:ring-primary outline-none text-sm" />
                    </div>
                    {activeTab === 'pedidos' && (
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-text-secondary mb-1">Estado</label>
                            <select value={estado} onChange={(e) => setEstado(e.target.value)} className="w-full px-3 py-2.5 rounded-input border border-border bg-white/60 focus:ring-2 focus:ring-primary outline-none text-sm">
                                <option value="">Todos los estados</option>
                                {ORDER_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    )}
                    <div className="flex gap-2">
                        <button onClick={applyFilters} className="flex items-center gap-2 px-5 py-2.5 rounded-btn bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium shadow-md hover:brightness-110 transition-all">
                            <SearchIcon /> Aplicar
                        </button>
                        <button onClick={resetFilters} className="px-5 py-2.5 rounded-btn border border-border text-text-secondary hover:bg-primary/5 text-sm transition-all">Limpiar</button>
                    </div>
                </div>
            </div>

            {/* Summary cards */}
            {summaryCards.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {summaryCards.map((card, idx) => (
                        <div key={idx} className="glass-card rounded-card p-5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center flex-shrink-0">
                                <span className={card.color}><card.icon /></span>
                            </div>
                            <div>
                                <p className="text-2xl font-title font-bold text-text-primary">{card.value}</p>
                                <p className="text-sm text-text-secondary">{card.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Content */}
            {activeTab === 'ventas' && renderVentas()}
            {activeTab === 'pedidos' && renderPedidos()}
            {activeTab === 'productos' && renderProductos()}
            {activeTab === 'inventario' && renderInventario()}
        </div>
    );
}
