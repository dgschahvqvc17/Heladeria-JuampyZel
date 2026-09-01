import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PublicRoute() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="text-secondary">Cargando...</span>
            </div>
        );
    }

    return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}
