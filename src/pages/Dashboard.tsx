import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Home, TrendingUp, Users } from 'lucide-react';

const data = [
    { name: 'Ene', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 2000 },
    { name: 'Abr', sales: 2780 },
    { name: 'May', sales: 1890 },
    { name: 'Jun', sales: 2390 },
    { name: 'Jul', sales: 3490 },
];

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-card border border-white/5 relative overflow-hidden group"
    >
        {/* Gradient Glow */}
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
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground mt-2">Resumen general de la actividad inmobiliaria.</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Ventas Totales" value="$452,000" change="+12.5%" icon={DollarSign} color="from-blue-500 to-cyan-500" />
                <StatCard title="Propiedades Activas" value="24" change="+4.3%" icon={Home} color="from-purple-500 to-pink-500" />
                <StatCard title="Beneficio Neto" value="$84,300" change="+8.1%" icon={TrendingUp} color="from-emerald-500 to-green-500" />
                <StatCard title="Agentes Activos" value="12" change="0%" icon={Users} color="from-orange-500 to-yellow-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 p-6 rounded-3xl bg-card border border-white/5 h-[400px] relative overflow-hidden"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold text-lg">Rendimiento de Ventas</h3>
                        <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm outline-none">
                            <option>Últimos 6 meses</option>
                            <option>Este Año</option>
                        </select>
                    </div>
                    <ResponsiveContainer width="100%" height="85%">
                        <AreaChart data={data}>
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
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
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
                    className="p-6 rounded-3xl bg-card border border-white/5 h-[400px] overflow-hidden flex flex-col"
                >
                    <h3 className="font-semibold text-lg mb-6">Actividad Reciente</h3>
                    <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                        {[1, 2, 3, 4, 5].map((_, i) => (
                            <div key={i} className="flex gap-4 items-start pb-4 border-b border-white/5 last:border-0">
                                <div className="h-10 w-10 rounded-full bg-white/10 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium">Carlos Agente <span className="text-muted-foreground font-normal">registró una visita en</span></p>
                                    <p className="text-sm text-blue-400">Torre Reforma 220</p>
                                    <span className="text-xs text-muted-foreground mt-1 block">Hace 2 horas</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
