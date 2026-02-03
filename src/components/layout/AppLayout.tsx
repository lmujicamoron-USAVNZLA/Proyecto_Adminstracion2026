import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, DollarSign, Settings, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { ToastContainer } from '../notifications/ToastContainer';

const SidebarItem = ({ icon: Icon, label, to }: { icon: React.ElementType, label: string, to: string }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                    isActive
                        ? "bg-primary/10 text-primary-foreground font-medium shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )
            }
        >
            {({ isActive }) => (
                <>
                    <Icon size={20} className="relative z-10" />
                    <span className="relative z-10">{label}</span>
                    {isActive && (
                        <div className="absolute left-0 top-0 h-full w-1 bg-primary blur-[2px]" />
                    )}
                </>
            )}
        </NavLink>
    );
};

export const AppLayout = () => {
    const { signOut, user } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario';
    const initials = fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <div className="flex h-screen bg-background overflow-hidden text-foreground selection:bg-primary/30">
            {/* Glassmorphism Sidebar */}
            <aside className="w-64 flex-shrink-0 border-r border-white/5 bg-card/30 backdrop-blur-xl flex flex-col relative z-20">
                <div className="p-6 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <Building2 className="text-white" size={18} />
                    </div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        Nexus CRM
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/" />
                    <SidebarItem icon={Building2} label="Propiedades" to="/properties" />
                    <SidebarItem icon={Users} label="Agentes" to="/agents" />
                    <SidebarItem icon={DollarSign} label="Finanzas" to="/finance" />
                    <div className="my-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <SidebarItem icon={Settings} label="Administración" to="/admin" />
                </nav>

                <div className="p-4 mt-auto">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 relative overflow-hidden flex flex-col">
                {/* Abstract Background Blurs */}
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />

                {/* Header */}
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 backdrop-blur-sm relative z-30">
                    <h2 className="text-lg font-medium text-muted-foreground">Bienvenido, <span className="text-foreground">{fullName}</span></h2>
                    <div className="flex items-center gap-4">
                        <NotificationCenter />
                        <div className="h-px w-4 bg-white/10" />
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 border border-white/10 flex items-center justify-center">
                            <span className="font-bold text-sm text-white">{initials}</span>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-auto p-8 relative z-10 flex flex-col">
                    <Outlet />
                </div>
                <ToastContainer />
            </main>
        </div>
    );
};
