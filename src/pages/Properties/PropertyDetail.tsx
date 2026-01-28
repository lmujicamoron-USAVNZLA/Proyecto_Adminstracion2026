import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
    ArrowLeft, MapPin, Calendar, User,
    FileText, CheckCircle2, Clock, Briefcase, Calculator
} from 'lucide-react';
import type { Property, Transaction } from '../../types';
import { useNotifications } from '../../context/NotificationContext';

// Mock Data (fallback)
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

import React from 'react';

const TimelineItem = ({ icon: Icon, title, date, description, color }: { icon: React.ElementType, title: string, date: string, description: string, color: string }) => {
    const getStyles = (colorClass: string) => {
        if (colorClass.includes('green')) return { border: 'border-green-400/50', bg: 'bg-green-400/10', text: 'text-green-400' };
        if (colorClass.includes('blue')) return { border: 'border-blue-400/50', bg: 'bg-blue-400/10', text: 'text-blue-400' };
        if (colorClass.includes('purple')) return { border: 'border-purple-400/50', bg: 'bg-purple-400/10', text: 'text-purple-400' };
        return { border: 'border-gray-400/50', bg: 'bg-gray-400/10', text: 'text-gray-400' };
    };

    const s = getStyles(color);

    return (
        <div className="flex gap-4 pb-8 last:pb-0 relative">
            <div className="flex flex-col items-center">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${s.border} ${s.bg} ${s.text} z-10 relative`}>
                    <Icon size={18} />
                </div>
                <div className="w-0.5 bg-white/10 flex-1 absolute top-10 bottom-0 last:hidden" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">{date}</p>
                <h4 className="font-bold text-sm mt-0.5 text-foreground truncate">{title}</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">{description}</p>
            </div>
        </div>
    );
};

export const PropertyDetail = () => {
    const { addNotification } = useNotifications();
    const { id } = useParams();
    const [property, setProperty] = useState<Property | null>(null);
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newActivity, setNewActivity] = useState({ type: 'visita', notes: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    async function fetchData() {
        try {
            setLoading(true);
            const [propRes, transRes, actRes] = await Promise.all([
                supabase.from('properties').select('*, agent:profiles(*)').eq('id', id).single(),
                supabase.from('transactions').select('*').eq('property_id', id).maybeSingle(),
                supabase.from('property_activity').select('*').eq('property_id', id).order('created_at', { ascending: false })
            ]);

            if (propRes.error) throw propRes.error;
            setProperty(propRes.data);
            setTransaction(transRes.data);
            setActivities(actRes.data || []);
        } catch (error) {
            console.error('Error fetching property details:', error);
            if (id === '1') {
                setProperty(MOCK_PROPERTY);
                setTransaction(MOCK_TRANSACTION);
                setActivities([
                    { id: '1', type: 'captacion', notes: 'Propiedad registrada en el sistema.', created_at: '2023-10-15T12:00:00Z' },
                    { id: '2', type: 'visita', notes: 'Visita con Ana García, interesada.', created_at: '2024-02-05T10:00:00Z' }
                ]);
            }
        } finally {
            setLoading(false);
        }
    }

    const handleAddActivity = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newActivity.notes) return;

        setIsSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { data, error } = await supabase
                .from('property_activity')
                .insert([{
                    property_id: id,
                    performed_by: user?.id,
                    type: newActivity.type,
                    notes: newActivity.notes
                }])
                .select();

            if (error) throw error;
            if (data) {
                setActivities([data[0], ...activities]);
                setNewActivity({ type: 'visita', notes: '' });
            }
        } catch (error) {
            console.error('Error adding activity:', error);
            // Demo fallback
            const demoAct = {
                id: Math.random().toString(),
                type: newActivity.type,
                notes: newActivity.notes,
                created_at: new Date().toISOString()
            };
            setActivities([demoAct, ...activities]);
            setNewActivity({ type: 'visita', notes: '' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const displayProperty = property || MOCK_PROPERTY;
    const displayTransaction = transaction || (id === '1' ? MOCK_TRANSACTION : null);

    if (loading) {
        return (
            <div className="flex justify-center p-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/properties" className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{displayProperty.title}</h1>
                        <p className="text-muted-foreground flex items-center gap-2 mt-1">
                            <MapPin size={16} /> {displayProperty.address}
                        </p>
                    </div>
                </div>
                <div className="sm:ml-auto flex gap-3">
                    <button className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors">
                        Editar
                    </button>
                    <button
                        onClick={async () => {
                            const statuses: any[] = ['captado', 'visitado', 'en_tramite', 'vendido', 'financiado'];
                            const currentIndex = statuses.indexOf(displayProperty.status);
                            const nextStatus = statuses[(currentIndex + 1) % statuses.length];

                            try {
                                const { error } = await supabase
                                    .from('properties')
                                    .update({ status: nextStatus })
                                    .eq('id', id);

                                if (error) throw error;

                                setProperty(prev => prev ? { ...prev, status: nextStatus } : null);
                                addNotification({
                                    title: 'Estado Actualizado',
                                    message: `La propiedad ahora está en estado: ${nextStatus.toUpperCase()}`,
                                    type: 'info'
                                });
                            } catch (e) {
                                // Fallback local
                                setProperty(prev => prev ? { ...prev, status: nextStatus } : null);
                                addNotification({
                                    title: 'Estado Actualizado (Local)',
                                    message: `Simulación: Propiedad en ${nextStatus.toUpperCase()}`,
                                    type: 'info'
                                });
                            }
                        }}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-blue-500/20"
                    >
                        Siguiente Estado
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="aspect-video rounded-3xl overflow-hidden bg-muted relative group shadow-2xl">
                        {displayProperty.image_url ? (
                            <img src={displayProperty.image_url} alt={displayProperty.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-white/5"><FileText size={48} className="text-white/20" /></div>
                        )}
                        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-4 py-2 rounded-2xl text-lg font-bold border border-white/10 shadow-xl">
                            ${displayProperty.price?.toLocaleString()}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 rounded-2xl bg-card border border-white/5">
                            <div className="text-muted-foreground text-xs uppercase tracking-widest mb-1 flex items-center gap-2 font-bold opacity-70"><User size={14} /> Propietario</div>
                            <div className="font-semibold text-lg">{displayProperty.owner_name || 'Desconocido'}</div>
                        </div>
                        <div className="p-5 rounded-2xl bg-card border border-white/5">
                            <div className="text-muted-foreground text-xs uppercase tracking-widest mb-1 flex items-center gap-2 font-bold opacity-70"><Calendar size={14} /> Registro</div>
                            <div className="font-semibold text-lg">{new Date(displayProperty.created_at).toLocaleDateString()}</div>
                        </div>
                    </div>

                    <div className="p-8 rounded-3xl bg-card border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5"><Calculator size={120} /></div>
                        <h3 className="font-semibold text-xl mb-6 flex items-center gap-2 relative z-10 text-primary">
                            <FileText size={20} /> Detalles de la Transacción
                        </h3>

                        {displayTransaction ? (
                            <div className="space-y-6 relative z-10">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                                    <div>
                                        <label className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">Comprador</label>
                                        <p className="font-semibold text-xl text-foreground mt-1">{displayTransaction.buyer_name}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">Venta Final</label>
                                        <p className="font-bold text-xl text-green-400 mt-1">${displayTransaction.final_price?.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">Instancia Notarial</label>
                                        <p className="font-medium flex items-center gap-2 mt-1">
                                            <Briefcase size={16} className="text-purple-400" /> {displayTransaction.notary_name}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">Valuación Técnica</label>
                                        <p className="font-medium flex items-center gap-2 mt-1">
                                            <CheckCircle2 size={16} className="text-orange-400" /> {displayTransaction.surveyor_name}
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-white/5">
                                    <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 flex flex-col sm:flex-row justify-between items-center gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-primary/10 text-primary"><Calculator size={20} /></div>
                                            <div>
                                                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Comisión Nexus</p>
                                                <p className="text-sm text-primary font-medium">Cálculo basado en corretaje pactado</p>
                                            </div>
                                        </div>
                                        <span className="text-3xl font-black text-white">${displayTransaction.commission_amount?.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl">
                                <p className="text-muted-foreground font-medium">No hay transacción activa registrada.</p>
                                <button className="mt-4 bg-white/5 hover:bg-white/10 px-6 py-2 rounded-xl text-sm font-bold border border-white/5 transition-all">Iniciar Proceso de Venta</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar: Activity & Agent */}
                <div className="space-y-8">
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-white/10 flex items-center gap-4 shadow-xl">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-2xl font-black text-white shadow-lg">
                            {displayProperty.agent?.full_name.charAt(0) || '?'}
                        </div>
                        <div>
                            <p className="text-[10px] text-blue-300 uppercase font-black tracking-widest mb-1">Responsable</p>
                            <p className="font-bold text-lg leading-tight">{displayProperty.agent?.full_name || 'Sin asignar'}</p>
                            <p className="text-xs text-muted-foreground opacity-60 mt-1">{displayProperty.agent?.email || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-card border border-white/5 space-y-6">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Clock size={18} className="text-primary" /> Historial de CRM
                        </h3>

                        <form onSubmit={handleAddActivity} className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                            <div className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Nueva Bitácora</div>
                            <select
                                value={newActivity.type}
                                onChange={e => setNewActivity({ ...newActivity, type: e.target.value })}
                                className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary/50"
                            >
                                <option value="visita">Visita</option>
                                <option value="llamada">Llamada</option>
                                <option value="oferta">Oferta</option>
                                <option value="otro">Otro</option>
                            </select>
                            <textarea
                                placeholder="Escribe notas aquí..."
                                value={newActivity.notes}
                                onChange={e => setNewActivity({ ...newActivity, notes: e.target.value })}
                                className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary/50 resize-none h-20"
                            />
                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? 'REGISTRANDO...' : 'AÑADIR LOG'}
                            </button>
                        </form>

                        <div className="pt-4 space-y-0 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {activities.length > 0 ? activities.map(act => (
                                <TimelineItem
                                    key={act.id}
                                    icon={act.type === 'visita' ? User : act.type === 'llamada' ? Briefcase : FileText}
                                    color={act.type === 'visita' ? 'blue' : act.type === 'captacion' ? 'green' : 'purple'}
                                    date={new Date(act.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                    title={act.type.toUpperCase()}
                                    description={act.notes}
                                />
                            )) : (
                                <div className="text-center py-4 text-xs text-muted-foreground italic">Sin actividad registrada.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
