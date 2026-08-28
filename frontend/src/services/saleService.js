const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`
    };
}

export async function getSales(branchId) {
    const query = branchId ? `?branch=${encodeURIComponent(branchId)}` : '';
    const response = await fetch(`${API_URL}/sales${query}`, { headers: getAuthHeaders() });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener las ventas.');
    return data;
}

export async function getSaleById(id) {
    const response = await fetch(`${API_URL}/sales/${id}`, { headers: getAuthHeaders() });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener la venta.');
    return data;
}

export async function getProductsForSale(branchId) {
    const query = `?sucursal=${encodeURIComponent(branchId)}`;
    const response = await fetch(`${API_URL}/sales/products${query}`, { headers: getAuthHeaders() });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener los productos.');
    return data;
}

export async function createSale(saleData) {
    const response = await fetch(`${API_URL}/sales`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(saleData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al registrar la venta.');
    return data;
}
