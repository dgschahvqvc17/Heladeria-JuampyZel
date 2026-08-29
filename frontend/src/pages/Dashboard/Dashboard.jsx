import { useState, useMemo } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const CustomersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const BoxIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
);

const StoreIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <path d="M9 22V12h6v10" />
    </svg>
);

const ShoppingCartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
);

const DollarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
);

const PackageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
);

const BarChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
);

const StoreBagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
);

const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);

const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);

const IceCreamIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C9.5 2 7.5 4 7.5 6.5c0 1.5.7 2.8 1.8 3.7L12 22l2.7-11.8c1.1-.9 1.8-2.2 1.8-3.7C16.5 4 14.5 2 12 2z" />
        <path d="M8 8c-1.5 0-3 .5-4 1.5" />
        <path d="M16 8c1.5 0 3 .5 4 1.5" />
        <circle cx="12" cy="6" r="1" fill="currentColor" />
    </svg>
);

const navItems = [
    { icon: <HomeIcon />, label: 'Dashboard', path: '/', roles: ['ADMINISTRADOR', 'ENCARGADO_SUCURSAL', 'INVENTARIO'] },
    { icon: <UsersIcon />, label: 'Usuarios', path: '/usuarios', roles: ['ADMINISTRADOR'] },
    { icon: <BoxIcon />, label: 'Productos', path: '/productos', roles: ['ADMINISTRADOR', 'ENCARGADO_SUCURSAL', 'VENDEDOR', 'INVENTARIO'] },
    { icon: <StoreIcon />, label: 'Sucursales', path: '/sucursales', roles: ['ADMINISTRADOR', 'ENCARGADO_SUCURSAL'] },
    { icon: <StoreBagIcon />, label: 'Tiendas', path: '/tiendas', roles: ['ADMINISTRADOR', 'INVENTARIO'] },
    { icon: <ShoppingCartIcon />, label: 'Pedidos', path: '/pedidos', roles: ['ADMINISTRADOR', 'ENCARGADO_SUCURSAL', 'INVENTARIO'] },
    { icon: <StoreBagIcon />, label: 'Portal Tienda', path: '/tienda', roles: ['TIENDA'] },
    { icon: <CustomersIcon />, label: 'Clientes', path: '/clientes', roles: ['ADMINISTRADOR', 'ENCARGADO_SUCURSAL', 'VENDEDOR', 'INVENTARIO'] },
    { icon: <DollarIcon />, label: 'Ventas', path: '/ventas', roles: ['ADMINISTRADOR', 'ENCARGADO_SUCURSAL', 'VENDEDOR'] },
    { icon: <PackageIcon />, label: 'Inventario', path: '/inventario', roles: ['ADMINISTRADOR', 'INVENTARIO'] },
    { icon: <BarChartIcon />, label: 'Reportes', path: '/reportes', roles: ['ADMINISTRADOR'] },
    { icon: <SettingsIcon />, label: 'Configuracion', path: '/configuracion', roles: ['ADMINISTRADOR'] },
];

export default function Dashboard() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const filteredNavItems = useMemo(() => {
        return navItems.filter((item) => {
            if (!item.roles?.includes(user?.rol)) {
                return false;
            }
            return true;
        });
    }, [user?.rol]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Buenos dias';
        if (hour < 18) return 'Buenas tardes';
        return 'Buenas noches';
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-primary/10 via-card to-secondary/10 border-r border-border/50 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-border/50">
                        <Link to="/" className="flex items-center gap-3 group" onClick={() => setSidebarOpen(false)}>
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-2xl blur-lg group-hover:blur-xl transition-all"></div>
                                <img
                                    src="/img/JuampyZel_Logo.png"
                                    alt="Logo JuampyZel"
                                    className="h-12 w-auto relative drop-shadow-md"
                                />
                            </div>
                            <div>
                                <h1 className="text-xl font-title font-bold text-gradient">JuampyZel</h1>
                                <p className="text-xs text-text-secondary">Panel de control</p>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {filteredNavItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                                        isActive
                                            ? 'bg-gradient-to-r from-primary/15 to-secondary/15 text-primary shadow-sm'
                                            : 'text-text-secondary hover:text-text-primary hover:bg-primary/5'
                                    }`}
                                >
                                    <span className={`transition-colors ${isActive ? 'text-primary' : 'text-text-secondary group-hover:text-primary'}`}>
                                        {item.icon}
                                    </span>
                                    <span className={`font-medium text-sm ${isActive ? 'font-semibold' : ''}`}>
                                        {item.label}
                                    </span>
                                    {isActive && (
                                        <div className="ml-auto w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary"></div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User section */}
                    <div className="p-4 border-t border-border/50">
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                                {user?.nombre?.charAt(0)}{user?.apellido?.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-text-primary truncate">
                                    {user?.nombre} {user?.apellido}
                                </p>
                                <p className="text-xs text-text-secondary truncate">{user?.rol}</p>
                            </div>
                            <button
                                onClick={logout}
                                className="p-2 rounded-xl text-text-secondary hover:text-error hover:bg-error/10 transition-all"
                                title="Cerrar sesion"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-screen lg:ml-72">
                {/* Header */}
                <header className="sticky top-0 z-30 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_200%] animate-gradient-x shadow-lg">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all"
                            >
                                <MenuIcon />
                            </button>
                            <div>
                                <h2 className="text-xl font-title font-bold text-white">
                                    {getGreeting()}, {user?.nombre}
                                </h2>
                                <p className="text-sm text-white/80">
                                    Panel de control de JuampyZel
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="relative p-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all">
                                <BellIcon />
                                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-accent rounded-full border-2 border-primary"></span>
                            </button>
                            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-white/20">
                                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xs">
                                    {user?.nombre?.charAt(0)}{user?.apellido?.charAt(0)}
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-white">
                                        {user?.nombre} {user?.apellido}
                                    </p>
                                    <p className="text-xs text-white/70">{user?.rol}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-6">
                    {location.pathname === '/' ? (
                        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl scale-150 animate-pulse-glow"></div>
                                <div className="relative text-primary/40">
                                    <IceCreamIcon />
                                </div>
                            </div>
                            <h3 className="text-2xl font-title font-bold text-text-primary mb-2">
                                {user?.rol === 'TIENDA'
                                    ? `Bienvenido, ${user?.tienda?.nombre || user?.nombre}`
                                    : 'Bienvenido a JuampyZel'}
                            </h3>
                            <p className="text-text-secondary max-w-md">
                                {user?.rol === 'TIENDA'
                                    ? 'Gestiona tus pedidos desde el catalogo disponible.'
                                    : 'El panel de control estara disponible cuando se conecte a la base de datos.'}
                            </p>
                        </div>
                    ) : (
                        <Outlet />
                    )}
                </main>
            </div>
        </div>
    );
}
