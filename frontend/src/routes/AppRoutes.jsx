import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import Usuarios from '../pages/Usuarios/Usuarios';
import Sucursales from '../pages/Sucursales/Sucursales';
import Clientes from '../pages/Clientes/Clientes';
import Tiendas from '../pages/Tiendas/Tiendas';
import Productos from '../pages/Productos/Productos';
import Ventas from '../pages/Ventas/Ventas';
import Pedidos from '../pages/Pedidos/Pedidos';
import Tienda from '../pages/Tienda/Tienda';
import Inventario from '../pages/Inventario/Inventario';
import Alertas from '../pages/Alertas/Alertas';
import Reportes from '../pages/Reportes/Reportes';
import MiPerfil from '../pages/MiPerfil/MiPerfil';


export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route element={<Dashboard />}>
                    <Route index element={<div />} />
                    <Route path="/usuarios" element={<Usuarios />} />
                    <Route path="/sucursales" element={<Sucursales />} />
                    <Route path="/clientes" element={<Clientes />} />
                    <Route path="/tiendas" element={<Tiendas />} />
                    <Route path="/productos" element={<Productos />} />
                    <Route path="/ventas" element={<Ventas />} />
                    <Route path="/pedidos" element={<Pedidos />} />
                    <Route path="/inventario" element={<Inventario />} />
                    <Route path="/tienda" element={<Tienda />} />
                    <Route path="/alertas" element={<Alertas />} />
                    <Route path="/reportes" element={<Reportes />} />
                    <Route path="/configuracion" element={<MiPerfil />} />
                </Route>
            </Route>
        </Routes>
    );
}