import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white p-6">
                    <div className="fixed inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md w-full relative z-10"
                    >
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
                                <AlertTriangle size={160} />
                            </div>

                            <div className="flex flex-col items-center text-center">
                                <div className="p-4 rounded-3xl bg-red-500/10 text-red-400 mb-6">
                                    <AlertTriangle size={40} />
                                </div>
                                <h1 className="text-2xl font-black tracking-tight mb-2">Algo salió mal</h1>
                                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                                    Ha ocurrido un error inesperado en la interfaz. No te preocupes, tus datos están a salvo.
                                </p>

                                <div className="w-full bg-black/40 border border-white/5 p-4 rounded-2xl text-[10px] font-mono text-red-300/70 overflow-auto max-h-32 mb-8 custom-scrollbar text-left">
                                    {this.state.error?.toString()}
                                </div>

                                <div className="flex flex-col gap-3 w-full">
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                                    >
                                        <RefreshCw size={18} /> RECARGAR SISTEMA
                                    </button>
                                    <button
                                        onClick={() => window.location.href = '/'}
                                        className="flex items-center justify-center gap-2 w-full bg-white/5 text-muted-foreground py-3.5 rounded-2xl font-bold hover:bg-white/10 transition-all"
                                    >
                                        <Home size={18} /> VOLVER AL INICIO
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}
