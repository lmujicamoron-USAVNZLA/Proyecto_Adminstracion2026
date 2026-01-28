import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Bell, Database, Globe, Lock, Palette, Cpu } from 'lucide-react';

const SettingCard = ({ icon: Icon, title, description, badge, onClick }: {
    icon: React.ElementType,
    title: string,
    description: string,
    badge?: string,
    onClick?: () => void
}) => (
    <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="p-6 rounded-3xl bg-card border border-white/5 hover:border-primary/20 transition-all cursor-pointer group"
    >
        <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-white/5 text-primary group-hover:scale-110 transition-transform">
                <Icon size={24} />
            </div>
            <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-lg">{title}</h3>
                    {badge && (
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                            {badge}
                        </span>
                    )}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
            </div>
        </div>
    </motion.div>
);

import { useNotifications } from '../../context/NotificationContext';

export const AdminSettings = () => {
    const { addNotification } = useNotifications();
    const [isOnline, setIsOnline] = useState(true);

    const toggleSystemStatus = () => {
        const nextStatus = !isOnline;
        setIsOnline(nextStatus);

        addNotification({
            title: nextStatus ? 'Sistema Restaurado' : 'Modo Mantenimiento',
            message: nextStatus
                ? 'La plataforma vuelve a estar operativa para todos los usuarios.'
                : 'El acceso público ha sido restringido temporalmente.',
            type: nextStatus ? 'success' : 'warning'
        });
    };

    const handleAction = (title: string) => {
        addNotification({
            title: `Sección: ${title}`,
            message: 'Este panel de configuración estará disponible en la próxima actualización.',
            type: 'info'
        });
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Administración</h2>
                    <p className="text-muted-foreground mt-2">Configuración global del sistema y seguridad.</p>
                </div>
                <button
                    onClick={toggleSystemStatus}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold uppercase transition-all duration-300 ${isOnline
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }`}
                >
                    <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${isOnline ? 'bg-green-400' : 'bg-yellow-400'}`} />
                    {isOnline ? 'Sistema Online' : 'Modo Mantenimiento'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SettingCard
                    icon={Shield}
                    title="Seguridad y Roles"
                    description="Configura permisos granulares, políticas de contraseñas y autenticación de dos factores."
                    badge="Crítico"
                    onClick={() => handleAction("Seguridad")}
                />
                <SettingCard
                    icon={Database}
                    title="Base de Datos"
                    description="Gestiona las conexiones, respaldos automáticos y optimización de consultas en tiempo real."
                    onClick={() => handleAction("Base de Datos")}
                />
                <SettingCard
                    icon={Palette}
                    title="Personalización"
                    description="Ajusta los colores de marca, logotipos y la apariencia visual de la plataforma para tu empresa."
                    badge="Nuevo"
                    onClick={() => handleAction("Personalización")}
                />
                <SettingCard
                    icon={Bell}
                    title="Notificaciones"
                    description="Configura las alertas de sistema, correos automáticos y webhooks para integraciones externas."
                    onClick={() => handleAction("Notificaciones")}
                />
                <SettingCard
                    icon={Globe}
                    title="Ubicaciones y Zonas"
                    description="Gestiona las áreas geográficas y divisas permitidas para las propiedades del inventario."
                    onClick={() => handleAction("Ubicaciones")}
                />
                <SettingCard
                    icon={Lock}
                    title="Auditoría"
                    description="Revisa los registros de actividad detallados y el historial de cambios de todos los usuarios."
                    onClick={() => handleAction("Auditoría")}
                />
                <SettingCard
                    icon={Cpu}
                    title="API & Integraciones"
                    description="Genera tokens de acceso para conectar aplicaciones de terceros o portales inmobiliarios."
                    onClick={() => handleAction("API")}
                />
                <SettingCard
                    icon={Settings}
                    title="General"
                    description="Información de la empresa, zona horaria y preferencias generales de funcionamiento."
                    onClick={() => handleAction("General")}
                />
            </div>

            {/* System Status Section */}
            <div className="mt-8 p-8 rounded-3xl bg-gradient-to-br from-blue-900/10 to-purple-900/10 border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Cpu size={120} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2 text-center md:text-left">
                        <h4 className="font-bold text-xl">Uso de Recursos</h4>
                        <p className="text-muted-foreground text-sm">Monitoreo de rendimiento del servidor Nexus CRM.</p>
                    </div>
                    <div className="flex gap-12">
                        <div className="text-center group/item">
                            <div className="text-2xl font-bold group-hover/item:text-primary transition-colors">12%</div>
                            <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">CPU</div>
                        </div>
                        <div className="text-center group/item">
                            <div className="text-2xl font-bold group-hover/item:text-primary transition-colors">458MB</div>
                            <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">RAM</div>
                        </div>
                        <div className="text-center group/item">
                            <div className="text-2xl font-bold group-hover/item:text-primary transition-colors">0.8ms</div>
                            <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Ping</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
