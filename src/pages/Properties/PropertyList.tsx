import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, MapPin, Search, Filter, Plus } from 'lucide-react';
import type { Property, PropertyStatus, Profile } from '../../types';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../../context/NotificationContext';

const StatusBadge = ({ status }: { status: PropertyStatus }) => {
    const styles = {
        captado: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        visitado: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        vendido: 'bg-green-500/10 text-green-400 border-green-500/20',
        financiado: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        en_tramite: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.captado}`}>
            {status.replace('_', ' ').toUpperCase()}
        </span>
    );
};

export const PropertyList = () => {
    const { addNotification } = useNotifications();
    const [filter, setFilter] = useState('all');
    const [properties, setProperties] = useState<Property[]>([]);
    const [agents, setAgents] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProperty, setNewProperty] = useState({
        title: '',
        address: '',
        price: '',
        status: 'captado' as PropertyStatus,
        image_url: '',
        agent_id: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            setLoading(true);
            const [propsRes, agentsRes] = await Promise.all([
                supabase.from('properties').select('*').order('created_at', { ascending: false }),
                supabase.from('profiles').select('*').order('full_name', { ascending: true })
            ]);

            if (propsRes.error) throw propsRes.error;
            setProperties(propsRes.data || []);
            setAgents(agentsRes.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleCreateProperty = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const propertyToInsert = {
                title: newProperty.title,
                address: newProperty.address,
                price: parseFloat(newProperty.price),
                status: newProperty.status,
                image_url: newProperty.image_url || null,
                agent_id: newProperty.agent_id || null
            };

            const { data, error } = await supabase
                .from('properties')
                .insert([propertyToInsert])
                .select();

            if (error) throw error;

            if (data) {
                setProperties([data[0], ...properties]);
                setIsModalOpen(false);
                addNotification({
                    title: 'Propiedad Captada',
                    message: `${newProperty.title} ha sido añadida exitosamente.`,
                    type: 'success'
                });
                setNewProperty({ title: '', address: '', price: '', status: 'captado', image_url: '', agent_id: '' });
            }
        } catch (error) {
            console.error('Error creating property:', error);
            // Fallback for demo
            const demoProp: Property = {
                id: Math.random().toString(),
                ...newProperty,
                price: parseFloat(newProperty.price),
                created_at: new Date().toISOString()
            } as Property;
            setProperties([demoProp, ...properties]);
            setIsModalOpen(false);
            addNotification({
                title: 'Propiedad Creada (Demo)',
                message: `${newProperty.title} añadida localmente.`,
                type: 'info'
            });
        }
    };

    const filteredProperties = properties.filter(p => filter === 'all' || p.status === filter);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Propiedades</h2>
                    <p className="text-muted-foreground mt-1">Gestiona tu inventario inmobiliario.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-blue-500/20 font-medium"
                >
                    <Plus size={18} />
                    Nueva Propiedad
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card border border-white/10 w-full max-w-2xl rounded-3xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold">Captar Nueva Propiedad</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-white text-2xl px-2">✕</button>
                        </div>

                        <form onSubmit={handleCreateProperty} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Título del Inmueble</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Ej: Penthouse con vista al parque"
                                        value={newProperty.title}
                                        onChange={e => setNewProperty({ ...newProperty, title: e.target.value })}
                                        className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Precio ($)</label>
                                    <input
                                        required
                                        type="number"
                                        placeholder="0.00"
                                        value={newProperty.price}
                                        onChange={e => setNewProperty({ ...newProperty, price: e.target.value })}
                                        className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Dirección Completa</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Calle, Número, Ciudad, Estado"
                                        value={newProperty.address}
                                        onChange={e => setNewProperty({ ...newProperty, address: e.target.value })}
                                        className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Estado Inicial</label>
                                    <select
                                        value={newProperty.status}
                                        onChange={e => setNewProperty({ ...newProperty, status: e.target.value as PropertyStatus })}
                                        className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                                    >
                                        <option value="captado">Captado</option>
                                        <option value="visitado">Visitado</option>
                                        <option value="en_tramite">En Trámite</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Agente Responsable</label>
                                    <select
                                        value={newProperty.agent_id}
                                        onChange={e => setNewProperty({ ...newProperty, agent_id: e.target.value })}
                                        className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                                    >
                                        <option value="">Seleccionar Agente...</option>
                                        {agents.map(agent => (
                                            <option key={agent.id} value={agent.id}>{agent.full_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">URL de Imagen (Opcional)</label>
                                    <input
                                        type="url"
                                        placeholder="https://images.unsplash.com/..."
                                        value={newProperty.image_url}
                                        onChange={e => setNewProperty({ ...newProperty, image_url: e.target.value })}
                                        className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 font-bold transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                                >
                                    Crear Propiedad
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-card border border-white/5">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por dirección, título o propietario..."
                        className="w-full bg-background/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                    <Filter size={18} className="text-muted-foreground mr-2" />
                    {['all', 'captado', 'visitado', 'vendido', 'en_tramite'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filter === status
                                ? 'bg-primary/20 text-primary border border-primary/20'
                                : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                                }`}
                        >
                            {status === 'all' ? 'Todos' : status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Property Grid */}
            {loading ? (
                <div className="flex justify-center p-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : filteredProperties.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 border border-white/5 rounded-2xl bg-card/50">
                    <Building2 className="text-muted-foreground mb-4" size={48} />
                    <h3 className="text-xl font-semibold mb-2">No hay propiedades</h3>
                    <p className="text-muted-foreground">No se encontraron propiedades en la base de datos.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProperties.map((property, index) => (
                        <motion.div
                            key={property.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group rounded-2xl bg-card border border-white/5 overflow-hidden hover:border-primary/30 transition-all hover:shadow-2xl hover:shadow-primary/5"
                        >
                            {/* Image Area */}
                            <div className="h-48 bg-muted relative overflow-hidden">
                                {property.image_url ? (
                                    <img
                                        src={property.image_url}
                                        alt={property.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                                        <Building2 size={40} className="text-white/20" />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3">
                                    <StatusBadge status={property.status} />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-white font-medium flex items-center gap-2">
                                        <MapPin size={14} className="text-blue-400" /> {property.address}
                                    </p>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="p-5">
                                <h3 className="font-semibold text-lg line-clamp-1 mb-2 group-hover:text-primary transition-colors">{property.title}</h3>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Precio de Venta</p>
                                        <p className="text-xl font-bold text-white">
                                            {property.price ? `$${property.price.toLocaleString()}` : 'Consultar'}
                                        </p>
                                    </div>
                                    <Link to={`/properties/${property.id}`} className="px-3 py-1.5 rounded-lg bg-white/5 text-sm font-medium hover:bg-white/10 transition-colors">
                                        Ver Detalles
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};
