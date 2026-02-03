import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Shield, Search, Plus, MoreVertical } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Profile } from '../../types';
import { useNotifications } from '../../context/NotificationContext';

export const AgentList = () => {
    const { addNotification } = useNotifications();
    const [agents, setAgents] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAgent, setNewAgent] = useState({ full_name: '', email: '', role: 'agent' as Profile['role'] });

    useEffect(() => {
        fetchAgents();
    }, []);

    async function fetchAgents() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('full_name', { ascending: true });

            if (error) throw error;
            setAgents(data || []);
        } catch (error) {
            console.error('Error fetching agents:', error);
            setAgents([
                { id: '1', full_name: 'Carlos Agente', email: 'carlos@nexus.com', role: 'agent', avatar_url: '' },
                { id: '2', full_name: 'Ana García', email: 'ana@nexus.com', role: 'editor', avatar_url: '' },
                { id: '3', full_name: 'Luis Admin', email: 'luis@nexus.com', role: 'admin', avatar_url: '' },
            ]);
        } finally {
            setLoading(false);
        }
    }

    const handleAddAgent = (e: React.FormEvent) => {
        e.preventDefault();
        const agentToAdd: Profile = {
            id: Math.random().toString(36).substr(2, 9),
            ...newAgent
        };
        setAgents([agentToAdd, ...agents]);
        setIsModalOpen(false);
        addNotification({
            title: 'Miembro Añadido',
            message: `${newAgent.full_name} se ha unido al equipo.`,
            type: 'success'
        });
        setNewAgent({ full_name: '', email: '', role: 'agent' });
    };

    const handleDeleteAgent = (id: string) => {
        const agent = agents.find(a => a.id === id);
        if (window.confirm(`¿Estás seguro de que deseas eliminar a ${agent?.full_name || 'este miembro'}?`)) {
            setAgents(agents.filter(a => a.id !== id));
            addNotification({
                title: 'Miembro Eliminado',
                message: `El acceso para ${agent?.full_name || 'el usuario'} ha sido revocado.`,
                type: 'warning'
            });
        }
    };

    const filteredAgents = agents.filter(agent =>
        agent.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const RoleBadge = ({ role }: { role: Profile['role'] }) => {
        const styles = {
            admin: 'bg-red-500/10 text-red-400 border-red-500/20',
            editor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            agent: 'bg-green-500/10 text-green-400 border-green-500/20',
        };

        return (
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${styles[role]}`}>
                {role}
            </span>
        );
    };

    return (
        <div className="space-y-6 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Agentes</h2>
                    <p className="text-muted-foreground mt-1">Gestión de equipo y permisos del sistema.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-blue-500/20 font-medium"
                >
                    <Plus size={18} />
                    Añadir Miembro
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card border border-white/10 w-full max-w-md rounded-3xl p-8 shadow-2xl"
                    >
                        <h3 className="text-2xl font-bold mb-6">Nuevo Miembro</h3>
                        <form onSubmit={handleAddAgent} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground ml-1">Nombre Completo</label>
                                <input
                                    required
                                    type="text"
                                    value={newAgent.full_name}
                                    onChange={e => setNewAgent({ ...newAgent, full_name: e.target.value })}
                                    className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="Ej: Juan Pérez"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground ml-1">Email Corporativo</label>
                                <input
                                    required
                                    type="email"
                                    value={newAgent.email}
                                    onChange={e => setNewAgent({ ...newAgent, email: e.target.value })}
                                    className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="juan@nexus.com"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground ml-1">Rol de Usuario</label>
                                <select
                                    value={newAgent.role}
                                    onChange={e => setNewAgent({ ...newAgent, role: e.target.value as Profile['role'] })}
                                    className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                                >
                                    <option value="agent">Agente</option>
                                    <option value="editor">Editor</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 font-medium transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Search */}
            <div className="p-4 rounded-2xl bg-card border border-white/5">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-background/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                    />
                </div>
            </div>

            {/* Agents Grid */}
            {loading ? (
                <div className="flex justify-center p-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : filteredAgents.length === 0 ? (
                <div className="text-center py-20 bg-card/50 rounded-3xl border border-white/5">
                    <p className="text-muted-foreground">No se encontraron miembros del equipo.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAgents.map((agent, index) => (
                        <motion.div
                            key={agent.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="group p-6 rounded-3xl bg-card border border-white/5 hover:border-primary/20 transition-all relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />

                            <div className="flex items-start justify-between relative z-10 mb-6">
                                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg group-hover:scale-105 transition-transform">
                                    {agent.full_name?.charAt(0) || agent.email.charAt(0).toUpperCase()}
                                </div>
                                <button
                                    onClick={() => handleDeleteAgent(agent.id)}
                                    className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
                                    title="Eliminar Miembro"
                                >
                                    <MoreVertical size={20} />
                                </button>
                            </div>

                            <div className="relative z-10 space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-xl group-hover:text-primary transition-colors">{agent.full_name || 'Sin nombre'}</h3>
                                        <RoleBadge role={agent.role} />
                                    </div>
                                    <p className="text-muted-foreground text-sm flex items-center gap-2">
                                        <Mail size={14} /> {agent.email}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                                    <button className="flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium transition-colors">
                                        <Shield size={14} /> Permisos
                                    </button>
                                    <button className="flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium transition-colors">
                                        <Phone size={14} /> Contactar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};
