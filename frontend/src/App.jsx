import { Link, Outlet } from 'react-router-dom';

export default function App() {
    return (
        <div>
            <nav className="bg-card border-b border-border p-4 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2">
                    <img
                        src="/img/JuampyZel_Logo.png"
                        alt="Logo JuampyZel"
                        className="h-8 w-auto"
                    />
                    <span className="text-2xl font-title font-bold text-primary">
                        JuampyZel
                    </span>
                </Link>
                <Link
                    to="/login"
                    className="text-text-secondary hover:text-primary transition-colors"
                >
                    Iniciar sesión
                </Link>
            </nav>
            <main className="min-h-[calc(100vh-64px)]">
                <Outlet />
            </main>
        </div>
    );
}
