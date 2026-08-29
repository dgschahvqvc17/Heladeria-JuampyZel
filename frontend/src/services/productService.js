const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_BASE = API_URL.replace(/\/api\/?$/, '');

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`
    };
}

function getAuthHeadersMultipart() {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token || ''}`
    };
}

export function getImageUrl(imagen) {
    if (!imagen) return null;
    if (/^https?:\/\//i.test(imagen)) return imagen;
    if (imagen.startsWith('/uploads/')) return `${API_BASE}${imagen}`;
    return imagen;
}

export function buildProductFormData(productData) {
    const formData = new FormData();
    formData.append('id_categoria', productData.id_categoria);
    formData.append('nombre', productData.nombre);
    formData.append('descripcion', productData.descripcion || '');
    formData.append('precio', productData.precio);
    formData.append('stock_minimo', productData.stock_minimo);
    formData.append('estado', productData.estado ? '1' : '0');
    if (productData.imageFile) {
        formData.append('imagen', productData.imageFile);
    }
    return formData;
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
        headers: getAuthHeadersMultipart(),
        body: buildProductFormData(productData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al registrar el producto.');
    return data;
}

export async function updateProduct(id, productData) {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeadersMultipart(),
        body: buildProductFormData(productData)
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
