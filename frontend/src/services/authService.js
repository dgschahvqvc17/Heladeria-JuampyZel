const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function login(correo, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
    }

    return data;
}

export async function logout() {
    const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error al cerrar sesión');
    }

    return data;
}

export async function getCurrentUser() {
    const token = localStorage.getItem('token');

    if (!token) {
        return null;
    }

    const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error al obtener el usuario');
    }

    return data;
}
