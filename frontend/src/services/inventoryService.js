const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`
    };
}

export async function getInventory(searchTerm) {
    const query = searchTerm ? `?q=${encodeURIComponent(searchTerm)}` : '';
    const response = await fetch(`${API_URL}/inventory${query}`, { headers: getAuthHeaders() });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener el inventario.');
    return data;
}

export async function getLowStock() {
    const response = await fetch(`${API_URL}/inventory/low-stock`, { headers: getAuthHeaders() });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener los productos con bajo stock.');
    return data;
}

export async function getMovements(filters = {}) {
    const params = new URLSearchParams();
    if (filters.producto) params.append('producto', filters.producto);
    if (filters.sucursal) params.append('sucursal', filters.sucursal);
    if (filters.tipo) params.append('tipo', filters.tipo);
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`${API_URL}/inventory/movements${query}`, { headers: getAuthHeaders() });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener los movimientos de inventario.');
    return data;
}

export async function getMovementById(id) {
    const response = await fetch(`${API_URL}/inventory/movements/${id}`, { headers: getAuthHeaders() });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener el movimiento de inventario.');
    return data;
}

export async function createMovement(movementData) {
    const response = await fetch(`${API_URL}/inventory/movements`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(movementData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al registrar el movimiento de inventario.');
    return data;
}

export async function adjustStock(idProducto, { nuevo_stock, motivo }) {
    const response = await fetch(`${API_URL}/inventory/${idProducto}/stock`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ nuevo_stock, motivo })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al ajustar el stock del producto.');
    return data;
}

export async function updateStockMinimo(idProducto, stock_minimo) {
    const response = await fetch(`${API_URL}/inventory/${idProducto}/stock-minimo`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ stock_minimo })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al actualizar el stock mínimo del producto.');
    return data;
}