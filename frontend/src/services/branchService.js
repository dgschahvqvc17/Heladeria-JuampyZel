const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`
    };
}

export async function getBranches() {
    const response = await fetch(`${API_URL}/branches`, { headers: getAuthHeaders() });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener sucursales.');
    return data;
}

export async function createBranch(branchData) {
    const response = await fetch(`${API_URL}/branches`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(branchData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al registrar la sucursal.');
    return data;
}

export async function updateBranch(id, branchData) {
    const response = await fetch(`${API_URL}/branches/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(branchData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al actualizar la sucursal.');
    return data;
}

export async function toggleBranchStatus(id) {
    const response = await fetch(`${API_URL}/branches/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al cambiar estado.');
    return data;
}

export async function getAvailableManagers() {
    const response = await fetch(`${API_URL}/branches/managers/disponibles`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener los encargados disponibles.');
    return data;
}