import { Link } from 'react-router-dom';
import {
    ArrowLeft, MapPin, Calendar, User,
    FileText, CheckCircle2, Clock, Briefcase, Calculator
} from 'lucide-react';
import type { Property, Transaction } from '../../types';

// Mock Data (simulating a fetch)
const MOCK_PROPERTY: Property = {
    id: '1',
    title: 'Modern Apartment in City Center',
    address: 'Av. Reforma 222, Mexico City',
    price: 450000,
    status: 'captado',
    agent_id: 'a1',
    owner_name: 'Roberto Gomez',
    created_at: '2023-10-15',
    image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop&q=80',
    agent: {
        id: 'a1',
        role: 'agent',
        full_name: 'Carlos Agente',
        email: 'carlos@nexus.com',
        avatar_url: undefined
    }
};

const MOCK_TRANSACTION: Transaction | null = { // Null if not sold/in process
    id: 't1',
    property_id: '1',
    buyer_name: 'Ana García',
    final_price: 445000,
    commission_amount: 22250,
    notary_name: 'Lic. Pablo Notario',
    surveyor_name: 'Ing. Luis Perito',
    signature_date: '2024-02-15',
    status: 'pendiente'
};

const TimelineItem = ({ icon: Icon, title, date, description, color }: any) => (
    <div className="flex gap-4 pb-8 last:pb-0 relative">
        <div className="flex flex-col items-center">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 border-[${color}] bg-[${color}]/10 text-[${color}] z-10 relative bg-background`}>
                <Icon size={18} className={color} />
            </div>
            <div className="w-0.5 bg-white/10 flex-1 absolute top-10 bottom-0 last:hidden" />
        </div>
        <div>
            <p className="text-sm text-muted-foreground">{date}</p>
            <h4 className="font-semibold text-base mt-0.5">{title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
    </div>
);

export const PropertyDetail = () => {
    // In real app: useQuery(id)

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/properties" className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{MOCK_PROPERTY.title}</h1>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        <MapPin size={16} /> {MOCK_PROPERTY.address}
                    </p>
                </div>
                <div className="ml-auto flex gap-3">
                    <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors">
                        Editar
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-blue-500/20">
                        Cambiar Estado
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Image */}
                    <div className="aspect-video rounded-3xl overflow-hidden bg-muted relative group">
                        <img
                            src={MOCK_PROPERTY.image_url}
                            alt={MOCK_PROPERTY.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold border border-white/10">
                            ${MOCK_PROPERTY.price.toLocaleString()}
                        </div>
                    </div>

                    {/* Details Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 rounded-2xl bg-card border border-white/5">
                            <div className="text-muted-foreground text-sm mb-1 flex items-center gap-2"><User size={16} /> Propietario</div>
                            <div className="font-semibold text-lg">{MOCK_PROPERTY.owner_name}</div>
                        </div>
                        <div className="p-5 rounded-2xl bg-card border border-white/5">
                            <div className="text-muted-foreground text-sm mb-1 flex items-center gap-2"><Calendar size={16} /> Fecha Captación</div>
                            <div className="font-semibold text-lg">{MOCK_PROPERTY.created_at}</div>
                        </div>
                    </div>

                    {/* Transaction Info (If exists) */}
                    <div className="p-6 rounded-3xl bg-card border border-white/5">
                        <h3 className="font-semibold text-xl mb-6 flex items-center gap-2">
                            <FileText className="text-blue-400" /> Detalles de la Transacción
                        </h3>

                        {MOCK_TRANSACTION ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                    <div>
                                        <label className="text-xs text-muted-foreground uppercase tracking-wider">Comprador</label>
                                        <p className="font-medium text-lg text-foreground">{MOCK_TRANSACTION.buyer_name}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-muted-foreground uppercase tracking-wider">Precio Final</label>
                                        <p className="font-medium text-lg text-green-400">${MOCK_TRANSACTION.final_price?.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-muted-foreground uppercase tracking-wider">Notaría</label>
                                        <p className="font-medium flex items-center gap-2">
                                            <Briefcase size={16} className="text-purple-400" /> {MOCK_TRANSACTION.notary_name}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-muted-foreground uppercase tracking-wider">Perito</label>
                                        <p className="font-medium flex items-center gap-2">
                                            <CheckCircle2 size={16} className="text-orange-400" /> {MOCK_TRANSACTION.surveyor_name}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5">
                                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                                        <span className="flex items-center gap-2 font-medium">
                                            <Calculator size={18} className="text-blue-400" /> Comisión Esperada
                                        </span>
                                        <span className="text-xl font-bold text-white">${MOCK_TRANSACTION.commission_amount?.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-10 text-muted-foreground">
                                <p>No hay transacción activa para esta propiedad.</p>
                                <button className="mt-4 text-primary hover:underline">Iniciar Venta</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar: Activity Timeline & Agent */}
                <div className="space-y-8">

                    {/* Agent Card */}
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/10 flex items-center gap-4">
                        <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xl font-bold text-white">
                            {MOCK_PROPERTY.agent?.full_name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-semibold">Agente Asignado</p>
                            <p className="font-bold text-lg">{MOCK_PROPERTY.agent?.full_name}</p>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="p-6 rounded-3xl bg-card border border-white/5">
                        <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                            <Clock size={18} /> Actividad Reciente
                        </h3>
                        <div className="space-y-0">
                            <TimelineItem
                                icon={FileText} color="text-green-400"
                                date="15 Feb 2024" title="Firma de Escrituras"
                                description="Programada con Lic. Pablo Notario."
                            />
                            <TimelineItem
                                icon={CheckCircle2} color="text-blue-400"
                                date="10 Feb 2024" title="Avalúo Completado"
                                description="Ing. Luis Perito entregó el dictamen."
                            />
                            <TimelineItem
                                icon={User} color="text-purple-400"
                                date="05 Feb 2024" title="Visita con Cliente"
                                description="Ana García mostró mucho interés."
                            />
                            <TimelineItem
                                icon={CheckCircle2} color="text-gray-400"
                                date="15 Oct 2023" title="Propiedad Captada"
                                description="Registrada en el sistema."
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
