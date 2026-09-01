const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`
    };
}

export async function getUsers() {
    const response = await fetch(`${API_URL}/users`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error al obtener los usuarios.');
    }
    return data;
}

export async function getUserById(id) {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error al obtener el usuario.');
    }
    return data;
}

export async function createUser(userData) {
    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error al registrar el usuario.');
    }
    return data;
}

export async function updateUser(id, userData) {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar el usuario.');
    }
    return data;
}

export async function toggleUserStatus(id) {
    const response = await fetch(`${API_URL}/users/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error al cambiar el estado del usuario.');
    }
    return data;
}
