const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`
    };
}

export async function getCategories() {
    const response = await fetch(`${API_URL}/categories`, { headers: getAuthHeaders() });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener las categorías.');
    return data;
}

export async function getActiveCategories() {
    const response = await fetch(`${API_URL}/categories/active`, { headers: getAuthHeaders() });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener las categorías.');
    return data;
}

export async function createCategory(categoryData) {
    const response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al registrar la categoría.');
    return data;
}

export async function updateCategory(id, categoryData) {
    const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al actualizar la categoría.');
    return data;
}

export async function toggleCategoryStatus(id) {
    const response = await fetch(`${API_URL}/categories/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al cambiar el estado de la categoría.');
    return data;
}
