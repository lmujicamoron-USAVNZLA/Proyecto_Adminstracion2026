import { motion } from 'framer-motion';
import React from 'react';

interface PlaceholderPageProps {
    title: string;
    description?: string;
    icon?: React.ElementType;
}

export const PlaceholderPage = ({ title, description, icon: Icon }: PlaceholderPageProps) => {
    return (
        <div className="h-full flex flex-col space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                <p className="text-muted-foreground mt-2">{description || 'Módulo en desarrollo.'}</p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 rounded-3xl bg-card/30 border border-white/5 flex flex-col items-center justify-center text-center p-12 backdrop-blur-sm relative overflow-hidden"
            >
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                {Icon && (
                    <div className="h-28 w-28 rounded-3xl bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center mb-8 text-primary shadow-xl ring-1 ring-white/10">
                        <Icon size={56} strokeWidth={1.5} />
                    </div>
                )}

                <h3 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                    Próximamente
                </h3>

                <p className="text-muted-foreground max-w-lg text-lg leading-relaxed mb-8">
                    El módulo de <b className="text-foreground">{title}</b> está en construcción. Pronto podrás acceder a todas sus funcionalidades.
                </p>

                <button className="px-8 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-all duration-300 active:scale-95">
                    Notificarme del Lanzamiento
                </button>
            </motion.div>
        </div>
    );
};
