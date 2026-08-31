import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { changePassword } from '../../services/authService';

const ROL_LABELS = {
    ADMINISTRADOR: 'Administrador',
    ENCARGADO_SUCURSAL: 'Encargado de Sucursal',
    INVENTARIO: 'Inventario',
    VENDEDOR: 'Vendedor',
    TIENDA: 'Tienda'
};

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);
const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
);
const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
);
const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
);

const EMPTY_FORM = { password_actual: '', password_nueva: '', password_confirm: '' };

export default function MiPerfil() {
    const { user } = useAuth();
    const [form, setForm] = useState(EMPTY_FORM);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        if (!form.password_actual) return 'Debe ingresar su contraseña actual.';
        if (!form.password_nueva) return 'Debe ingresar la nueva contraseña.';
        if (form.password_nueva.length < 6) return 'La nueva contraseña debe tener al menos 6 caracteres.';
        if (form.password_nueva !== form.password_confirm) return 'Las contraseñas nuevas no coinciden.';
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validate();
        if (validationError) { setError(validationError); setSuccess(''); return; }

        try {
            setSubmitting(true);
            setError('');
            setSuccess('');
            await changePassword(form.password_actual, form.password_nueva);
            setForm(EMPTY_FORM);
            setSuccess('Contraseña actualizada correctamente.');
        } catch (err) {
            setError(err.message || 'Error al cambiar la contraseña.');
        } finally {
            setSubmitting(false);
        }
    };

    const infoItems = [
        { icon: <UserIcon />, label: 'Nombre', value: `${user?.nombre || ''} ${user?.apellido || ''}` },
        { icon: <MailIcon />, label: 'Correo electrónico', value: user?.correo || '' },
        { icon: <ShieldIcon />, label: 'Rol', value: ROL_LABELS[user?.rol] || user?.rol || '' }
    ];

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <h1 className="text-2xl font-title font-bold text-text-primary">Mi Perfil</h1>
                <p className="text-text-secondary text-sm mt-1">Consulta tu información personal y cambia tu contraseña</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Información personal (solo lectura) */}
                <div className="glass-card rounded-card p-6">
                    <div className="flex items-center gap-4 mb-6 pb-5 border-b border-border/50">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-2xl">
                            {user?.nombre?.charAt(0)}{user?.apellido?.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-lg font-title font-bold text-text-primary">
                                {user?.nombre} {user?.apellido}
                            </h3>
                            <p className="text-sm text-text-secondary">JuampyZel</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {infoItems.map((item) => (
                            <div key={item.label} className="flex items-center gap-4 p-4 rounded-input bg-white/50 border border-border/50">
                                <span className="text-primary flex-shrink-0">{item.icon}</span>
                                <div className="min-w-0">
                                    <p className="text-xs text-text-secondary">{item.label}</p>
                                    <p className="text-sm font-semibold text-text-primary truncate">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="text-xs text-text-secondary mt-4">El nombre, apellido y correo electrónico de tu cuenta solo pueden ser modificados por un administrador.</p>
                </div>

                {/* Cambio de contraseña */}
                <div className="glass-card rounded-card p-6">
                    <h3 className="text-lg font-title font-bold text-text-primary flex items-center gap-2 mb-1">
                        <span className="text-primary"><LockIcon /></span> Cambiar contraseña
                    </h3>
                    <p className="text-sm text-text-secondary mb-6">Ingresa tu contraseña actual y la nueva dos veces para confirmarla.</p>

                    {error && <div className="p-3 mb-4 rounded-input bg-error/10 text-error text-sm">{error}</div>}
                    {success && <div className="p-3 mb-4 rounded-input bg-fresh/10 text-green-700 text-sm">{success}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-1.5">Contraseña actual *</label>
                            <input type="password" name="password_actual" value={form.password_actual} onChange={handleChange} className="w-full px-4 py-3 rounded-input border border-border bg-white/60 focus:ring-2 focus:ring-primary outline-none" placeholder="Tu contraseña actual" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-1.5">Nueva contraseña *</label>
                            <input type="password" name="password_nueva" value={form.password_nueva} onChange={handleChange} className="w-full px-4 py-3 rounded-input border border-border bg-white/60 focus:ring-2 focus:ring-primary outline-none" placeholder="Mínimo 6 caracteres" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-1.5">Confirmar nueva contraseña *</label>
                            <input type="password" name="password_confirm" value={form.password_confirm} onChange={handleChange} className="w-full px-4 py-3 rounded-input border border-border bg-white/60 focus:ring-2 focus:ring-primary outline-none" placeholder="Repite la nueva contraseña" />
                        </div>
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-btn bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium shadow-md disabled:opacity-70 transition-all"
                            >
                                {submitting && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>}
                                Actualizar contraseña
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
