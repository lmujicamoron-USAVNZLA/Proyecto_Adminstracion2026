import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            navigate('/');
        } catch (err: any) {
            // For demo purposes, if Supabase is not connected (error includes "placeholder"), allow login as demo
            if (err.message && (err.message.includes('placeholder') || err.message.includes('fetch'))) {
                // Hack for demo if no backend
                console.warn("Supabase not connected. Allowing Demo Login.");
                // Manually setting a fake session in local storage or handling via state would be complex without modifying AuthProvider to support mock.
                // So we will just show the error, but adding a Demo Button separately is better.
                setError("No se pudo conectar a Supabase. Asegúrate de configurar las claves en .env");
            } else {
                setError(err.message || 'Error al iniciar sesión');
            }
        } finally {
            setLoading(false);
        }
    };

    // Helper for demo mode (since user might not have DB yet)
    const handleDemoLogin = () => {
        // This is a "fake" login that just redirects to dashboard. 
        // Note: Real AuthContext won't see this as logged in unless we mock it there too.
        // For now, allow bypass to see the app.
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-card/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20 mx-auto mb-4">
                        <Building2 className="text-white" size={24} />
                    </div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        Nexus CRM
                    </h1>
                    <p className="text-muted-foreground mt-2">Inicia sesión para continuar</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-2 text-red-400 text-sm">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-background/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                                placeholder="usuario@nexus.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground ml-1">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-background/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium py-2.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
                    >
                        {loading ? 'Entrando...' : (
                            <>
                                Iniciar Sesión <ArrowRight size={18} />
                            </>
                        )}
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">O continúa como</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleDemoLogin}
                        className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-2.5 rounded-xl border border-white/10 transition-colors text-sm"
                    >
                        Demo (Sin Base de Datos)
                    </button>
                </form>
            </motion.div>
        </div>
    );
};
