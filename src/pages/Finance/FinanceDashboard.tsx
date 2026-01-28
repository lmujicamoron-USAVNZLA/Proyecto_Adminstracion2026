import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    DollarSign, TrendingUp,
    PieChart as PieIcon, Plus, FileText,
    ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { supabase } from '../../lib/supabase';
import type { Expense, Transaction } from '../../types';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export const FinanceDashboard = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFinanceData();
    }, []);

    async function fetchFinanceData() {
        try {
            setLoading(true);
            const [expRes, transRes] = await Promise.all([
                supabase.from('expenses').select('*').order('created_at', { ascending: false }),
                supabase.from('transactions').select('*, property:properties(title)').order('signature_date', { ascending: false })
            ]);

            setExpenses(expRes.data || []);
            setTransactions(transRes.data || []);
        } catch (error) {
            console.error('Error fetching finance data:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center p-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Mock data for charts if no data exists
    const chartData = [
        { name: 'Ene', income: 4500, expenses: 2100 },
        { name: 'Feb', income: 5200, expenses: 1800 },
        { name: 'Mar', income: 4800, expenses: 2400 },
        { name: 'Abr', income: 6100, expenses: 1900 },
        { name: 'May', income: 5900, expenses: 2200 },
        { name: 'Jun', income: 7200, expenses: 2500 },
    ];

    const totalIncome = transactions.reduce((acc, curr) => acc + (curr.commission_amount || 0), 0) || 32400;
    const totalExpenses = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 12850;
    const balance = totalIncome - totalExpenses;

    const expenseByCategory = [
        { name: 'Marketing', value: 4500 },
        { name: 'Operativo', value: 3200 },
        { name: 'Personal', value: 4150 },
        { name: 'Otros', value: 1000 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Finanzas</h2>
                    <p className="text-muted-foreground mt-1">Control de ingresos, comisiones y gastos operativos.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-white/5 border border-white/10 text-foreground px-4 py-2 rounded-xl hover:bg-white/10 transition-colors font-medium">
                        <FileText size={18} />
                        Exportar
                    </button>
                    <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-blue-500/20 font-medium">
                        <Plus size={18} />
                        Nuevo Registro
                    </button>
                </div>
            </div>

            {/* KPI Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-3xl bg-card border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <ArrowUpRight size={80} className="text-green-500" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Ingresos Totales (Comisiones)</p>
                    <h3 className="text-3xl font-bold text-white">${totalIncome.toLocaleString()}</h3>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-green-400 text-xs font-bold bg-green-500/10 px-2 py-0.5 rounded-full">+12.5%</span>
                        <span className="text-muted-foreground text-xs">vs periodo anterior</span>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-3xl bg-card border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <ArrowDownRight size={80} className="text-red-500" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Gastos Operativos</p>
                    <h3 className="text-3xl font-bold text-white">${totalExpenses.toLocaleString()}</h3>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-red-400 text-xs font-bold bg-red-500/10 px-2 py-0.5 rounded-full">-4.2%</span>
                        <span className="text-muted-foreground text-xs">ahorro en marketing</span>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-primary/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <DollarSign size={80} className="text-primary" />
                    </div>
                    <p className="text-sm font-medium text-primary/80 mb-1">Balance Neto</p>
                    <h3 className="text-3xl font-bold text-white">${balance.toLocaleString()}</h3>
                    <div className="mt-4 flex items-center gap-2">
                        <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[65%]" />
                        </div>
                        <span className="text-xs font-bold">65% Margen</span>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Revenue Chart */}
                <div className="lg:col-span-2 p-8 rounded-3xl bg-card border border-white/5 h-[450px] relative overflow-hidden">
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <h3 className="font-bold text-xl flex items-center gap-2">
                            <TrendingUp className="text-primary" size={20} /> Flujo de Caja
                        </h3>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold">MENSUAL</button>
                            <button className="px-3 py-1 rounded-lg hover:bg-white/5 text-muted-foreground text-xs font-bold transition-colors">ANUAL</button>
                        </div>
                    </div>
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `$${val / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(8px)' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="income" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                                <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" strokeDasharray="5 5" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Expense Distribution */}
                <div className="p-8 rounded-3xl bg-card border border-white/5 h-[450px] flex flex-col">
                    <h3 className="font-bold text-xl mb-8 flex items-center gap-2">
                        <PieIcon className="text-primary" size={20} /> Distribución de Gastos
                    </h3>
                    <div className="flex-1 min-h-0 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={expenseByCategory}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {expenseByCategory.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        {expenseByCategory.map((item, i) => (
                            <div key={item.name} className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                <span className="text-xs text-muted-foreground font-medium">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Table */}
            <div className="rounded-3xl bg-card border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-bold text-xl">Transacciones Recientes</h3>
                    <button className="text-primary text-sm font-bold hover:underline">Ver Todo</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/[0.02] text-muted-foreground text-xs uppercase tracking-widest font-bold">
                                <th className="px-6 py-4">Propiedad</th>
                                <th className="px-6 py-4">Fecha</th>
                                <th className="px-6 py-4">Valor Venta</th>
                                <th className="px-6 py-4">Comisión</th>
                                <th className="px-6 py-4 text-right">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {transactions.length > 0 ? (
                                transactions.slice(0, 5).map((t) => (
                                    <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4 font-medium">{(t as any).property?.title || 'Propiedad'}</td>
                                        <td className="px-6 py-4 text-muted-foreground text-sm">{t.signature_date}</td>
                                        <td className="px-6 py-4 font-bold">${t.final_price?.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-green-400 font-bold">${t.commission_amount?.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${t.status === 'completado' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                                                }`}>
                                                {t.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                [1, 2, 3].map((i) => (
                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4 font-medium uppercase text-xs tracking-wider">Demo Property {i}</td>
                                        <td className="px-6 py-4 text-muted-foreground text-sm">2024-03-{10 + i}</td>
                                        <td className="px-6 py-4 font-bold">$250,000</td>
                                        <td className="px-6 py-4 text-green-400 font-bold">$12,500</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="px-2 py-1 rounded-lg bg-green-500/10 text-green-400 text-[10px] font-bold uppercase">completado</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
