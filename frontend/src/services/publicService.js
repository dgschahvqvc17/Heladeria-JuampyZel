const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function getPublicStats() {
    const response = await fetch(`${API_URL}/public/stats`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener las estadísticas.');
    return data;
}
