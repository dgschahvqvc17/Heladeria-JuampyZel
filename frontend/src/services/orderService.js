const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`
    };
}

export async function getOrders() {
    const response = await fetch(`${API_URL}/orders`, { headers: getAuthHeaders() });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener los pedidos.');
    return data;
}

export async function getOrderById(id) {
    const response = await fetch(`${API_URL}/orders/${id}`, { headers: getAuthHeaders() });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener el pedido.');
    return data;
}

export async function getCatalogProducts() {
    const response = await fetch(`${API_URL}/orders/catalog/products`, { headers: getAuthHeaders() });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener el catálogo.');
    return data;
}

export async function createOrder(orderData) {
    const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(orderData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al registrar el pedido.');
    return data;
}

export async function updateOrderStatus(id, estado) {
    const response = await fetch(`${API_URL}/orders/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ estado })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al actualizar el estado del pedido.');
    return data;
}