const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`
    };
}

export async function getStores() {
    const response = await fetch(`${API_URL}/stores`, { headers: getAuthHeaders() });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener tiendas.');
    return data;
}

export async function createStore(storeData) {
    const response = await fetch(`${API_URL}/stores`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(storeData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al registrar la tienda.');
    return data;
}

export async function updateStore(id, storeData) {
    const response = await fetch(`${API_URL}/stores/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(storeData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al actualizar la tienda.');
    return data;
}

export async function toggleStoreStatus(id) {
    const response = await fetch(`${API_URL}/stores/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al cambiar estado.');
    return data;
}