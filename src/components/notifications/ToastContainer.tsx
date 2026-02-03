import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, AlertTriangle, CheckCircle, XCircle, X } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

export const ToastContainer = () => {
    const { notifications } = useNotifications();
    const [activeToasts, setActiveToasts] = useState<any[]>([]);

    useEffect(() => {
        if (notifications.length > 0) {
            const latest = notifications[0];
            // Only show as toast if it's less than 5 seconds old (freshly added)
            const timeDiff = Date.now() - new Date(latest.timestamp).getTime();
            if (timeDiff < 1000) {
                setActiveToasts(prev => {
                    if (prev.find(t => t.id === latest.id)) return prev;
                    return [...prev, latest];
                });

                // Auto remove after 5 seconds
                setTimeout(() => {
                    setActiveToasts(prev => prev.filter(t => t.id !== latest.id));
                }, 5000);
            }
        }
    }, [notifications]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="text-green-400" size={20} />;
            case 'warning': return <AlertTriangle className="text-yellow-400" size={20} />;
            case 'error': return <XCircle className="text-red-400" size={20} />;
            default: return <Info className="text-blue-400" size={20} />;
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
            <AnimatePresence>
                {activeToasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.9 }}
                        className="bg-card/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-start gap-4 w-80 pointer-events-auto"
                    >
                        <div className="mt-1">{getIcon(toast.type)}</div>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm">{toast.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{toast.message}</p>
                        </div>
                        <button
                            onClick={() => setActiveToasts(prev => prev.filter(t => t.id !== toast.id))}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
