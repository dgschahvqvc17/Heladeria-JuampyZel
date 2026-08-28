const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`
    };
}

export async function getProducts(searchTerm) {
    const query = searchTerm ? `?q=${encodeURIComponent(searchTerm)}` : '';
    const response = await fetch(`${API_URL}/products${query}`, { headers: getAuthHeaders() });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener los productos.');
    return data;
}

export async function getActiveProducts() {
    const response = await fetch(`${API_URL}/products/active`, { headers: getAuthHeaders() });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener los productos.');
    return data;
}

export async function getProductById(id) {
    const response = await fetch(`${API_URL}/products/${id}`, { headers: getAuthHeaders() });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener el producto.');
    return data;
}

export async function createProduct(productData) {
    const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al registrar el producto.');
    return data;
}

export async function updateProduct(id, productData) {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al actualizar el producto.');
    return data;
}

export async function toggleProductStatus(id) {
    const response = await fetch(`${API_URL}/products/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al cambiar el estado del producto.');
    return data;
}
