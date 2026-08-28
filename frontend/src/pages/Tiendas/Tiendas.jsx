import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStores, createStore, updateStore, toggleStoreStatus } from '../../services/storeService';

// Iconografía
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
);
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
);
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
);
const StoreBagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
);

const EMPTY_FORM = { nombre: '', responsable: '', telefono: '', correo: '', direccion: '' };

export default function Tiendas() {
    const { user } = useAuth();
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingStore, setEditingStore] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showDetail, setShowDetail] = useState(null);

    const isAdmin = user?.rol === 'ADMINISTRADOR';

    const loadStores = async () => {
        try {
            setLoading(true);
            const response = await getStores();
            setStores(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadStores(); }, []);

    const filteredStores = useMemo(() => {
        if (!search.trim()) return stores;
        const term = search.toLowerCase();
        return stores.filter((t) => 
            t.nombre.toLowerCase().includes(term) || 
            t.responsable.toLowerCase().includes(term) ||
            (t.correo && t.correo.toLowerCase().includes(term))
        );
    }, [stores, search]);

    const openCreateForm = () => {
        setEditingStore(null);
        setFormData(EMPTY_FORM);
        setFormError('');
        setShowForm(true);
    };

    const openEditForm = (store) => {
        setEditingStore(store);
        setFormData({
            nombre: store.nombre,
            responsable: store.responsable,
            telefono: store.telefono || '',
            correo: store.correo || '',
            direccion: store.direccion
        });
        setFormError('');
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingStore(null);
        setFormData(EMPTY_FORM);
        setFormError('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.nombre.trim()) return 'El nombre de la tienda es obligatorio.';
        if (formData.nombre.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres.';
        if (!formData.responsable.trim()) return 'El responsable es obligatorio.';
        if (formData.responsable.trim().length < 2) return 'El responsable debe tener al menos 2 caracteres.';
        if (!formData.direccion.trim()) return 'La dirección es obligatoria.';
        if (formData.direccion.trim().length < 5) return 'La dirección debe tener al menos 5 caracteres.';
        if (formData.correo.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo.trim())) {
            return 'El correo electrónico no tiene un formato válido.';
        }
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const error = validateForm();
        if (error) { setFormError(error); return; }

        try {
            setSubmitting(true);
            setFormError('');
            if (editingStore) {
                await updateStore(editingStore.id_tienda, formData);
            } else {
                await createStore(formData);
            }
            closeForm();
            loadStores();
        } catch (err) {
            setFormError(err.message || 'Error al guardar la tienda.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleStatus = async (store) => {
        try {
            await toggleStoreStatus(store.id_tienda);
            loadStores();
        } catch (error) { console.error(error); }
    };

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-title font-bold text-text-primary">Gestionar Tiendas</h1>
                    <p className="text-text-secondary text-sm mt-1">Administra los negocios que solicitan abastecimiento</p>
                </div>
                {isAdmin && (
                    <button onClick={openCreateForm} className="flex items-center gap-2 px-5 py-2.5 rounded-btn bg-gradient-to-r from-primary to-secondary text-white font-medium text-sm hover:brightness-110 shadow-md">
                        <PlusIcon /> Nueva Tienda
                    </button>
                )}
            </div>

            {/* Search Box */}
            <div className="glass-card rounded-card p-4 mb-6">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"><SearchIcon /></span>
                    <input type="text" placeholder="Buscar por nombre, responsable o correo..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-input border border-border bg-white/60 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" />
                </div>
            </div>

            {/* List/Table */}
            <div className="glass-card rounded-card overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div></div>
                ) : filteredStores.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-text-secondary">No se encontraron tiendas registradas</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/50 text-left text-xs font-semibold text-text-secondary uppercase">
                                    <th className="px-6 py-4">Comercio</th>
                                    <th className="px-6 py-4">Responsable</th>
                                    <th className="px-6 py-4">Teléfono</th>
                                    <th className="px-6 py-4">Estado</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStores.map((store) => (
                                    <tr key={store.id_tienda} className="border-b border-border/30 hover:bg-primary/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                                    <StoreBagIcon />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-text-primary">{store.nombre}</p>
                                                    <p className="text-xs text-text-secondary">{store.correo || 'Sin correo'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-text-primary">{store.responsable}</td>
                                        <td className="px-6 py-4 text-sm text-text-secondary">{store.telefono || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${store.estado ? 'bg-fresh/10 text-green-700' : 'bg-error/10 text-error'}`}>
                                                {store.estado ? 'Activa' : 'Inactiva'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => setShowDetail(store)} className="p-2 rounded-xl text-text-secondary hover:text-secondary hover:bg-secondary/10" title="Ver detalle"><EyeIcon /></button>
                                                {isAdmin && (
                                                    <>
                                                        <button onClick={() => openEditForm(store)} className="p-2 rounded-xl text-text-secondary hover:text-primary hover:bg-primary/10" title="Editar"><EditIcon /></button>
                                                        <button onClick={() => handleToggleStatus(store)} className={`px-3 py-1.5 rounded-xl text-xs font-medium ${store.estado ? 'text-error hover:bg-error/10' : 'text-fresh hover:bg-fresh/10'}`}>
                                                            {store.estado ? 'Desactivar' : 'Activar'}
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal de Detalle */}
            {showDetail && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="glass-card rounded-card w-full max-w-md p-6 animate-scale-in">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-title font-bold text-text-primary">Detalle de Tienda</h3>
                            <button onClick={() => setShowDetail(null)} className="p-2 rounded-xl hover:bg-primary/10"><CloseIcon /></button>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-xl font-bold text-primary">{showDetail.nombre}</h4>
                            <div className="flex justify-between py-2 border-b border-border/30"><span className="text-sm text-text-secondary">Responsable</span><span className="text-sm font-medium">{showDetail.responsable}</span></div>
                            <div className="flex justify-between py-2 border-b border-border/30"><span className="text-sm text-text-secondary">Dirección</span><span className="text-sm font-medium">{showDetail.direccion}</span></div>
                            <div className="flex justify-between py-2 border-b border-border/30"><span className="text-sm text-text-secondary">Teléfono</span><span className="text-sm font-medium">{showDetail.telefono || 'N/A'}</span></div>
                            <div className="flex justify-between py-2 border-b border-border/30"><span className="text-sm text-text-secondary">Correo</span><span className="text-sm font-medium break-all">{showDetail.correo || 'N/A'}</span></div>
                            <div className="flex justify-between py-2"><span className="text-sm text-text-secondary">Estado</span><span className={`text-sm font-bold ${showDetail.estado ? 'text-green-600' : 'text-error'}`}>{showDetail.estado ? 'Activa' : 'Inactiva'}</span></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Formulario de Crear / Editar */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="glass-card rounded-card w-full max-w-lg p-6 animate-scale-in">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-title font-bold text-text-primary">{editingStore ? 'Editar Tienda' : 'Nueva Tienda'}</h3>
                            <button onClick={closeForm} className="p-2 rounded-xl hover:bg-primary/10"><CloseIcon /></button>
                        </div>
                        {formError && <div className="p-3 mb-4 rounded-input bg-error/10 text-error text-sm">{formError}</div>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">Nombre Comercial *</label>
                                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="w-full px-4 py-3 rounded-input border border-border bg-white/60 focus:ring-2 focus:ring-primary outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">Responsable *</label>
                                    <input type="text" name="responsable" value={formData.responsable} onChange={handleChange} className="w-full px-4 py-3 rounded-input border border-border bg-white/60 focus:ring-2 focus:ring-primary outline-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">Teléfono</label>
                                    <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full px-4 py-3 rounded-input border border-border bg-white/60 focus:ring-2 focus:ring-primary outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">Correo Electrónico</label>
                                    <input type="email" name="correo" value={formData.correo} onChange={handleChange} className="w-full px-4 py-3 rounded-input border border-border bg-white/60 focus:ring-2 focus:ring-primary outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">Dirección *</label>
                                <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} className="w-full px-4 py-3 rounded-input border border-border bg-white/60 focus:ring-2 focus:ring-primary outline-none" />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={closeForm} className="px-5 py-2.5 rounded-btn border border-border text-text-secondary hover:bg-primary/5 text-sm transition-all">Cancelar</button>
                                <button type="submit" disabled={submitting} className="flex items-center gap-2 px-5 py-2.5 rounded-btn bg-gradient-to-r from-primary to-secondary text-white text-sm shadow-md disabled:opacity-70">
                                    {submitting && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>}
                                    {editingStore ? 'Guardar Cambios' : 'Registrar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}