const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`
    };
}

function buildQuery(params = {}) {
    const entries = Object.entries(params).filter(
        ([, value]) => value !== '' && value !== null && value !== undefined
    );
    if (entries.length === 0) return '';
    return `?${entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')}`;
}

async function request(url) {
    const response = await fetch(url, { headers: getAuthHeaders() });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener los reportes.');
    return data;
}

export async function getSalesReport(params) {
    const data = await request(`${API_URL}/reports/sales${buildQuery(params)}`);
    return data.data;
}

export async function getOrdersReport(params) {
    const data = await request(`${API_URL}/reports/orders${buildQuery(params)}`);
    return data.data;
}

export async function getProductsReport() {
    const data = await request(`${API_URL}/reports/products`);
    return data.data;
}

export async function getInventoryReport(params) {
    const data = await request(`${API_URL}/reports/inventory${buildQuery(params)}`);
    return data.data;
}

export async function getDashboardData() {
    const data = await request(`${API_URL}/reports/dashboard`);
    return data.data;
}
