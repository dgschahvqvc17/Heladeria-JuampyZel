const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`
    };
}

export async function getCustomers(searchTerm) {
    const query = searchTerm ? `?q=${encodeURIComponent(searchTerm)}` : '';
    const response = await fetch(`${API_URL}/customers${query}`, { headers: getAuthHeaders() });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener los clientes.');
    return data;
}

export async function createCustomer(customerData) {
    const response = await fetch(`${API_URL}/customers`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(customerData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al registrar el cliente.');
    return data;
}

export async function updateCustomer(id, customerData) {
    const response = await fetch(`${API_URL}/customers/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(customerData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al actualizar el cliente.');
    return data;
}
