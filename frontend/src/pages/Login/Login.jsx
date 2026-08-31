import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getPublicStats } from '../../services/publicService';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

const EyeOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeClosedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const IceCreamIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C9.5 2 7.5 4 7.5 6.5c0 1.5.7 2.8 1.8 3.7L12 22l2.7-11.8c1.1-.9 1.8-2.2 1.8-3.7C16.5 4 14.5 2 12 2z" />
        <path d="M8 8c-1.5 0-3 .5-4 1.5" />
        <path d="M16 8c1.5 0 3 .5 4 1.5" />
        <circle cx="12" cy="6" r="1" fill="currentColor" />
    </svg>
);

const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

export default function Login() {
    const [formData, setFormData] = useState({ correo: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [stats, setStats] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        let active = true;
        getPublicStats()
            .then((res) => {
                if (active) setStats(res.data);
            })
            .catch(() => {});
        return () => { active = false; };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.correo || !formData.password) {
            setError('El correo y la contraseña son obligatorios.');
            return;
        }

        setLoading(true);

        try {
            const data = await login(formData.correo, formData.password);

            if (data.success) {
                navigate('/');
            }
        } catch (err) {
            setError(err.message || 'Credenciales incorrectas.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex relative overflow-hidden">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative bg-gradient-to-br from-primary via-secondary to-primary bg-[length:200%_200%] animate-gradient-x items-center justify-center p-12">
                {/* Animated background shapes */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="floating-shape w-96 h-96 bg-white/10 top-20 -left-20" style={{ animationDelay: '0s' }}></div>
                    <div className="floating-shape w-64 h-64 bg-white/10 bottom-20 right-10" style={{ animationDelay: '2s' }}></div>
                    <div className="floating-shape w-48 h-48 bg-accent/20 top-1/2 left-1/3" style={{ animationDelay: '4s' }}></div>
                    <div className="floating-shape w-32 h-32 bg-white/15 top-10 right-1/4" style={{ animationDelay: '1s' }}></div>
                    <div className="floating-shape w-40 h-40 bg-white/10 bottom-1/3 left-10" style={{ animationDelay: '3s' }}></div>
                </div>

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }}></div>

                <div className="relative z-10 text-center text-white animate-fade-in">
                    <div className="mb-8 relative inline-block">
                        <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl scale-150 animate-pulse-glow"></div>
                        <img
                            src="/img/JuampyZel_Logo.png"
                            alt="Logo JuampyZel"
                            className="h-56 w-auto mx-auto relative drop-shadow-2xl animate-float"
                        />
                    </div>

                    <h1 className="text-5xl xl:text-6xl font-title font-extrabold mb-4 drop-shadow-lg">
                        JuampyZel
                    </h1>

                    <p className="text-xl text-white/90 font-medium mb-8 max-w-md mx-auto">
                        La mejor experiencia en helados artesanales
                    </p>

                    <div className="flex items-center justify-center gap-2 text-white/80">
                        <StarIcon />
                        <StarIcon />
                        <StarIcon />
                        <StarIcon />
                        <StarIcon />
                    </div>

                    <div className="mt-12 grid grid-cols-3 gap-8 max-w-sm mx-auto">
                        <div className="text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
                            <div className="text-3xl font-bold mb-1">{stats ? stats.total_sabores : '...'}</div>
                            <div className="text-sm text-white/70">Sabores de helado</div>
                        </div>
                        <div className="text-center animate-slide-up" style={{ animationDelay: '0.5s' }}>
                            <div className="text-3xl font-bold mb-1">{stats ? stats.total_sucursales : '...'}</div>
                            <div className="text-sm text-white/70">Sucursales</div>
                        </div>
                        <div className="text-center animate-slide-up" style={{ animationDelay: '0.7s' }}>
                            <div className="text-3xl font-bold mb-1">{stats ? stats.total_clientes : '...'}</div>
                            <div className="text-sm text-white/70">Clientes</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-8 bg-background relative">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                {/* Mobile logo (shown only on small screens) */}
                <div className="lg:hidden absolute top-8 left-1/2 -translate-x-1/2 text-center animate-fade-in">
                    <img
                        src="/img/JuampyZel.PNG"
                        alt="Logo JuampyZel"
                        className="h-20 w-auto mx-auto mb-2 drop-shadow-lg"
                    />
                    <h2 className="text-2xl font-title font-bold text-gradient">JuampyZel</h2>
                </div>

                <div className="w-full max-w-md relative z-10 animate-scale-in">
                    {/* Welcome text */}
                    <div className="text-center mb-8 mt-16 lg:mt-0 animate-slide-up">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 mb-4">
                            <IceCreamIcon />
                        </div>
                        <h2 className="text-3xl font-title font-bold text-text-primary mb-2">
                            Bienvenido de vuelta
                        </h2>
                        <p className="text-text-secondary">
                            Ingresa tus credenciales para acceder
                        </p>
                    </div>

                    {/* Login Card */}
                    <div className="glass-card rounded-3xl p-8 shadow-xl animate-slide-up-delay">
                        {error && (
                            <div className="mb-6 animate-bounce-in">
                                <Alert type="error" message={error} />
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email Field */}
                            <div className="group">
                                <label className="block text-sm font-semibold text-text-primary mb-2 transition-colors group-focus-within:text-primary">
                                    Correo electronico
                                </label>
                                <div className="relative">
                                    <span className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === 'correo' ? 'text-primary' : 'text-text-secondary'}`}>
                                        <MailIcon />
                                    </span>
                                    <input
                                        type="email"
                                        name="correo"
                                        placeholder="tu@correo.com"
                                        value={formData.correo}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('correo')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl glass-input text-text-primary placeholder-text-secondary/50 focus:outline-none transition-all duration-300"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="group">
                                <label className="block text-sm font-semibold text-text-primary mb-2 transition-colors group-focus-within:text-primary">
                                    Contrasena
                                </label>
                                <div className="relative">
                                    <span className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === 'password' ? 'text-primary' : 'text-text-secondary'}`}>
                                        <LockIcon />
                                    </span>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Tu contrasena segura"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full pl-12 pr-14 py-4 rounded-2xl glass-input text-text-primary placeholder-text-secondary/50 focus:outline-none transition-all duration-300"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all duration-200 ${showPassword ? 'text-primary bg-primary/10' : 'text-text-secondary hover:text-primary hover:bg-primary/5'}`}
                                        aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                                    >
                                        {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember me & Forgot password */}
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer" />
                                    <span className="text-text-secondary group-hover:text-text-primary transition-colors">Recordarme</span>
                                </label>
                                <a href="#" className="text-primary hover:text-primary-dark font-medium transition-colors hover:underline">
                                    Olvidaste tu contrasena?
                                </a>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-gradient text-white font-semibold py-4 px-6 rounded-2xl text-base shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                                        <span>Iniciando sesion...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Iniciar sesion</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>

                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '1s' }}>
                        <p className="text-xs text-text-secondary">
                            Problemas para acceder?{' '}
                            <a href="#" className="text-primary hover:text-primary-dark font-medium transition-colors">
                                Contacta al administrador
                            </a>
                        </p>
                        <p className="text-xs text-text-secondary/60 mt-3">
                            2025 JuampyZel — Todos los derechos reservados
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
