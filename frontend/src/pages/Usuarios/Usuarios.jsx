import { useState, useEffect, useMemo } from 'react';
import { getUsers, createUser, updateUser, toggleUserStatus } from '../../services/userService';

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

const ROLES = [
    { value: 'ADMINISTRADOR', label: 'Administrador' },
    { value: 'ENCARGADO_SUCURSAL', label: 'Encargado de Sucursal' },
    { value: 'VENDEDOR', label: 'Vendedor' },
    { value: 'INVENTARIO', label: 'Encargado de Inventario' }
];

const EMPTY_FORM = {
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    rol: 'VENDEDOR'
};

export default function Usuarios() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showDetail, setShowDetail] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await getUsers();
            setUsers(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        if (!search.trim()) return users;
        const term = search.toLowerCase();
        return users.filter(
            (u) =>
                u.nombre.toLowerCase().includes(term) ||
                u.apellido.toLowerCase().includes(term) ||
                u.correo.toLowerCase().includes(term)
        );
    }, [users, search]);

    const openCreateForm = () => {
        setEditingUser(null);
        setFormData(EMPTY_FORM);
        setFormError('');
        setShowForm(true);
    };

    const openEditForm = (user) => {
        setEditingUser(user);
        setFormData({
            nombre: user.nombre,
            apellido: user.apellido,
            correo: user.correo,
            password: '',
            rol: user.rol
        });
        setFormError('');
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingUser(null);
        setFormData(EMPTY_FORM);
        setFormError('');
        setShowPassword(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.nombre.trim()) return 'El nombre es obligatorio.';
        if (formData.nombre.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres.';
        if (!formData.apellido.trim()) return 'El apellido es obligatorio.';
        if (formData.apellido.trim().length < 2) return 'El apellido debe tener al menos 2 caracteres.';
        if (!formData.correo.trim()) return 'El correo es obligatorio.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.correo.trim())) return 'El correo no tiene un formato valido.';
        if (!editingUser && !formData.password.trim()) return 'La contrasena es obligatoria.';
        if (!editingUser && formData.password.length < 6) return 'La contrasena debe tener al menos 6 caracteres.';
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const error = validateForm();
        if (error) {
            setFormError(error);
            return;
        }

        try {
            setSubmitting(true);
            setFormError('');

            if (editingUser) {
                await updateUser(editingUser.id_usuario, {
                    nombre: formData.nombre.trim(),
                    apellido: formData.apellido.trim(),
                    correo: formData.correo.trim(),
                    rol: formData.rol
                });
            } else {
                await createUser({
                    nombre: formData.nombre.trim(),
                    apellido: formData.apellido.trim(),
                    correo: formData.correo.trim(),
                    password: formData.password,
                    rol: formData.rol
                });
            }

            closeForm();
            loadUsers();
        } catch (err) {
            setFormError(err.message || 'Error al guardar el usuario.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleStatus = async (user) => {
        try {
            await toggleUserStatus(user.id_usuario);
            loadUsers();
        } catch (error) {
            console.error(error);
        }
    };

    const getRoleLabel = (rol) => {
        const role = ROLES.find((r) => r.value === rol);
        return role ? role.label : rol;
    };

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-title font-bold text-text-primary">
                        Gestionar Usuarios
                    </h1>
                    <p className="text-text-secondary text-sm mt-1">
                        Administra los usuarios y roles del sistema
                    </p>
                </div>
                <button
                    onClick={openCreateForm}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-btn bg-gradient-to-r from-primary to-secondary text-white font-medium text-sm hover:brightness-110 transition-all shadow-md hover:shadow-lg"
                >
                    <PlusIcon />
                    Nuevo Usuario
                </button>
            </div>

            {/* Search */}
            <div className="glass-card rounded-card p-4 mb-6">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                        <SearchIcon />
                    </span>
                    <input
                        type="text"
                        placeholder="Buscar por nombre, apellido o correo..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-input border border-border bg-white/60 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="glass-card rounded-card overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                        <span className="ml-3 text-text-secondary">Cargando usuarios...</span>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="text-text-secondary/30 mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                        <p className="text-text-secondary font-medium">No se encontraron usuarios</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/50">
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                        Nombre
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                        Correo
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                        Rol
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                        Registro
                                    </th>
                                    <th className="text-right px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr
                                        key={user.id_usuario}
                                        className="border-b border-border/30 hover:bg-primary/5 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                                    {user.nombre?.charAt(0)}{user.apellido?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-text-primary">
                                                        {user.nombre} {user.apellido}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-text-secondary">
                                            {user.correo}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                                                {getRoleLabel(user.rol)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                                    user.estado
                                                        ? 'bg-fresh/10 text-green-700'
                                                        : 'bg-error/10 text-error'
                                                }`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${
                                                        user.estado ? 'bg-green-500' : 'bg-error'
                                                    }`}
                                                ></span>
                                                {user.estado ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-text-secondary">
                                            {new Date(user.fecha_registro).toLocaleDateString('es-BO', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setShowDetail(user)}
                                                    className="p-2 rounded-xl text-text-secondary hover:text-secondary hover:bg-secondary/10 transition-all"
                                                    title="Ver detalle"
                                                >
                                                    <EyeIcon />
                                                </button>
                                                <button
                                                    onClick={() => openEditForm(user)}
                                                    className="p-2 rounded-xl text-text-secondary hover:text-primary hover:bg-primary/10 transition-all"
                                                    title="Editar"
                                                >
                                                    <EditIcon />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStatus(user)}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                                                        user.estado
                                                            ? 'text-error hover:bg-error/10'
                                                            : 'text-fresh hover:bg-fresh/10'
                                                    }`}
                                                    title={user.estado ? 'Desactivar' : 'Activar'}
                                                >
                                                    {user.estado ? 'Desactivar' : 'Activar'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {showDetail && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="glass-card rounded-card w-full max-w-md p-6 animate-scale-in">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-title font-bold text-text-primary">
                                Detalle del Usuario
                            </h3>
                            <button
                                onClick={() => setShowDetail(null)}
                                className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-primary/10 transition-all"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
                                    {showDetail.nombre?.charAt(0)}{showDetail.apellido?.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-text-primary">
                                        {showDetail.nombre} {showDetail.apellido}
                                    </p>
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                            showDetail.estado
                                                ? 'bg-fresh/10 text-green-700'
                                                : 'bg-error/10 text-error'
                                        }`}
                                    >
                                        <span
                                            className={`w-1.5 h-1.5 rounded-full ${
                                                showDetail.estado ? 'bg-green-500' : 'bg-error'
                                            }`}
                                        ></span>
                                        {showDetail.estado ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between py-2 border-b border-border/30">
                                    <span className="text-sm text-text-secondary">Correo</span>
                                    <span className="text-sm font-medium text-text-primary">{showDetail.correo}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-border/30">
                                    <span className="text-sm text-text-secondary">Rol</span>
                                    <span className="text-sm font-medium text-text-primary">{getRoleLabel(showDetail.rol)}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-sm text-text-secondary">Fecha de registro</span>
                                    <span className="text-sm font-medium text-text-primary">
                                        {new Date(showDetail.fecha_registro).toLocaleDateString('es-BO', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create / Edit Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="glass-card rounded-card w-full max-w-lg p-6 animate-scale-in">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-title font-bold text-text-primary">
                                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                            </h3>
                            <button
                                onClick={closeForm}
                                className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-primary/10 transition-all"
                            >
                                <CloseIcon />
                            </button>
                        </div>

                        {formError && (
                            <div className="p-3 mb-4 rounded-input border border-error/30 bg-error/10 text-error text-sm">
                                {formError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">
                                        Nombre *
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        placeholder="Nombre"
                                        className="w-full px-4 py-3 rounded-input border border-border bg-white/60 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">
                                        Apellido *
                                    </label>
                                    <input
                                        type="text"
                                        name="apellido"
                                        value={formData.apellido}
                                        onChange={handleChange}
                                        placeholder="Apellido"
                                        className="w-full px-4 py-3 rounded-input border border-border bg-white/60 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">
                                    Correo electronico *
                                </label>
                                <input
                                    type="email"
                                    name="correo"
                                    value={formData.correo}
                                    onChange={handleChange}
                                    placeholder="correo@ejemplo.com"
                                    className="w-full px-4 py-3 rounded-input border border-border bg-white/60 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
                                />
                            </div>

                            {!editingUser && (
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">
                                        Contrasena *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Minimo 6 caracteres"
                                            className="w-full px-4 py-3 pr-11 rounded-input border border-border bg-white/60 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors"
                                        >
                                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">
                                    Rol *
                                </label>
                                <select
                                    name="rol"
                                    value={formData.rol}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-input border border-border bg-white/60 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
                                >
                                    {ROLES.map((role) => (
                                        <option key={role.value} value={role.value}>
                                            {role.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="px-5 py-2.5 rounded-btn border border-border text-text-secondary hover:bg-primary/5 font-medium text-sm transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-btn bg-gradient-to-r from-primary to-secondary text-white font-medium text-sm hover:brightness-110 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {submitting && (
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    )}
                                    {editingUser ? 'Guardar Cambios' : 'Registrar Usuario'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
