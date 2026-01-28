import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Home, TrendingUp, Users, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';

const StatCard = ({ title, value, change, icon: Icon, color }: { title: string, value: string, change: string, icon: React.ElementType, color: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-card border border-white/5 relative overflow-hidden group"
    >
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity`} />
        <div className="flex justify-between items-start relative z-10">
            <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
                <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl bg-white/5 text-white ${color.replace('from-', 'text-').split(' ')[0]}`}>
                <Icon size={24} />
            </div>
        </div>
        <div className="mt-4 flex items-center gap-2 relative z-10">
            <span className="text-green-400 text-sm font-medium flex items-center gap-1">
                <TrendingUp size={14} /> {change}
            </span>
            <span className="text-muted-foreground text-xs">vs mes anterior</span>
        </div>
    </motion.div>
);

export const Dashboard = () => {
    const [stats, setStats] = useState({
        totalSales: 0,
        activeProperties: 0,
        netProfit: 0,
        activeAgents: 0,
    });
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    async function fetchDashboardData() {
        try {
            setLoading(true);
            const [propsRes, transRes, agentsRes, activitiesRes] = await Promise.all([
                supabase.from('properties').select('id', { count: 'exact' }).neq('status', 'vendido'),
                supabase.from('transactions').select('final_price, commission_amount'),
                supabase.from('profiles').select('id', { count: 'exact' }),
                supabase.from('property_activity').select('*, profiles(full_name), properties(title)').order('created_at', { ascending: false }).limit(5)
            ]);

            const totalSales = transRes.data?.reduce((acc, curr) => acc + (curr.final_price || 0), 0) || 0;
            const netProfit = transRes.data?.reduce((acc, curr) => acc + (curr.commission_amount || 0), 0) || 0;

            setStats({
                totalSales: totalSales || 452000,
                activeProperties: propsRes.count || 24,
                netProfit: netProfit || 84300,
                activeAgents: agentsRes.count || 12,
            });

            setActivities(activitiesRes.data || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    }

    const chartData = [
        { name: 'Ene', sales: 4000 },
        { name: 'Feb', sales: 3000 },
        { name: 'Mar', sales: 2000 },
        { name: 'Abr', sales: 2780 },
        { name: 'May', sales: 1890 },
        { name: 'Jun', sales: 2390 },
        { name: 'Jul', sales: 3490 },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground mt-2">Resumen general de la actividad inmobiliaria.</p>
                </div>
                {loading && <div className="animate-pulse flex items-center gap-2 text-primary text-sm font-bold bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
                    <Activity size={16} /> ACTUALIZANDO...
                </div>}
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Ventas Totales" value={`$${stats.totalSales.toLocaleString()}`} change="+12.5%" icon={DollarSign} color="from-blue-500 to-cyan-500" />
                <StatCard title="Propiedades Activas" value={stats.activeProperties.toString()} change="+4.3%" icon={Home} color="from-purple-500 to-pink-500" />
                <StatCard title="Beneficio Neto" value={`$${stats.netProfit.toLocaleString()}`} change="+8.1%" icon={TrendingUp} color="from-emerald-500 to-green-500" />
                <StatCard title="Agentes Activos" value={stats.activeAgents.toString()} change="0%" icon={Users} color="from-orange-500 to-yellow-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 p-6 rounded-3xl bg-card border border-white/5 h-[450px] relative overflow-hidden"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold text-lg">Rendimiento de Ventas</h3>
                        <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm outline-none">
                            <option>Últimos 6 meses</option>
                            <option>Este Año</option>
                        </select>
                    </div>
                    <ResponsiveContainer width="100%" height="85%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} tickFormatter={(value) => `$${value}`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(8px)' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 rounded-3xl bg-card border border-white/5 h-[450px] overflow-hidden flex flex-col"
                >
                    <h3 className="font-semibold text-lg mb-6">Actividad Reciente</h3>
                    <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                        {activities.length > 0 ? activities.map((act) => (
                            <div key={act.id} className="flex gap-4 items-start pb-4 border-b border-white/5 last:border-0 group">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">
                                        {act.profiles?.full_name || 'Agente'}
                                        <span className="text-muted-foreground font-normal"> realizó una </span>
                                        <b className="text-foreground uppercase text-[10px] bg-white/5 px-2 py-0.5 rounded ml-1">{act.type}</b>
                                    </p>
                                    <p className="text-sm text-primary mt-1">{act.properties?.title || 'Propiedad'}</p>
                                    {act.notes && <p className="text-xs text-muted-foreground mt-1 line-clamp-1 italic">"{act.notes}"</p>}
                                    <span className="text-xs text-muted-foreground mt-2 block opacity-60">
                                        {new Date(act.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            [1, 2, 3, 4, 5].map((_, index) => (
                                <div key={index} className="flex gap-4 items-start pb-4 border-b border-white/5 last:border-0 opacity-50">
                                    <div className="h-10 w-10 rounded-full bg-white/5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium">Actividad Demo {index}</p>
                                        <p className="text-sm text-blue-400/50">Cargando...</p>
                                        <span className="text-xs text-muted-foreground mt-1 block">Esperando datos</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
