import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Trash2, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { cn } from '../../lib/utils';

export const NotificationCenter = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, markAsRead, clearAll } = useNotifications();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="text-green-400" size={16} />;
            case 'warning': return <AlertTriangle className="text-yellow-400" size={16} />;
            case 'error': return <XCircle className="text-red-400" size={16} />;
            default: return <Info className="text-blue-400" size={16} />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors relative group"
            >
                <Bell size={20} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-primary text-[10px] font-bold text-white items-center justify-center">
                            {unreadCount}
                        </span>
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-80 bg-card border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <h3 className="font-bold">Notificaciones</h3>
                            <button
                                onClick={clearAll}
                                className="text-[10px] bg-red-500/10 text-red-400 px-2 py-1 rounded-md hover:bg-red-500/20 transition-colors flex items-center gap-1"
                            >
                                <Trash2 size={12} /> Limpiar todo
                            </button>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                            {notifications.length > 0 ? (
                                notifications.map((n) => (
                                    <div
                                        key={n.id}
                                        onClick={() => markAsRead(n.id)}
                                        className={cn(
                                            "p-4 border-b border-white/5 hover:bg-white/[0.03] transition-colors cursor-pointer relative group",
                                            !n.read && "bg-primary/[0.02]"
                                        )}
                                    >
                                        <div className="flex gap-3">
                                            <div className="mt-1 flex-shrink-0">
                                                {getIcon(n.type)}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className={cn("text-xs font-bold leading-none", n.read ? "text-foreground/70" : "text-foreground")}>
                                                    {n.title}
                                                </p>
                                                <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                                                    {n.message}
                                                </p>
                                                <span className="text-[9px] text-muted-foreground/50 block font-medium">
                                                    {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            {!n.read && (
                                                <div className="mt-1">
                                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
                                    <Bell size={32} className="opacity-20" />
                                    <p className="text-sm italic">No tienes nuevas notificaciones.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
