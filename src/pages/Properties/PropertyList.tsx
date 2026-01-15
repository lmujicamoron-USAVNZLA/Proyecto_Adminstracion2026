import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, MapPin, Search, Filter, Plus } from 'lucide-react';
import type { Property, PropertyStatus } from '../../types';

// Mock Data
const MOCK_PROPERTIES: Property[] = [
    {
        id: '1',
        title: 'Modern Apartment in City Center',
        address: 'Av. Reforma 222, Mexico City',
        price: 450000,
        status: 'captado',
        agent_id: 'a1',
        owner_name: 'Roberto Gomez',
        created_at: '2023-10-15',
        image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXBhcnRtZW50fGVufDB8fDB8fHww'
    },
    {
        id: '2',
        title: 'Luxury Villa with Pool',
        address: 'Lomas de Chapultepec, Sierra Gorda 15',
        price: 1250000,
        status: 'vendido',
        agent_id: 'a2',
        owner_name: 'Maria Sanchez',
        created_at: '2023-09-20',
        image_url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bHV4dXJ5JTIwaG91c2V8ZW58MHx8MHx8fDA%3D'
    },
    {
        id: '3',
        title: 'Cozy Family Home',
        address: 'Col. Del Valle, Patricio Sanz 45',
        price: 320000,
        status: 'visitado',
        agent_id: 'a1',
        owner_name: 'Juan Perez',
        created_at: '2023-11-05',
        image_url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2V8ZW58MHx8MHx8fDA%3D'
    },
    {
        id: '4',
        title: 'Commercial Office Space',
        address: 'Polanco, Masaryk 101',
        price: 850000,
        status: 'en_tramite',
        agent_id: 'a3',
        owner_name: 'Inversiones SA',
        created_at: '2023-10-01',
        image_url: undefined
    }
];

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
    const [filter, setFilter] = useState('all');

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Propiedades</h2>
                    <p className="text-muted-foreground mt-1">Gestiona tu inventario inmobiliario.</p>
                </div>
                <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-blue-500/20 font-medium">
                    <Plus size={18} />
                    Nueva Propiedad
                </button>
            </div>

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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {MOCK_PROPERTIES.map((property, index) => (
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
                                        ${property.price.toLocaleString()}
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
        </div>
    );
};
