import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    signOut: () => Promise<void>;
    loading: boolean;
    enterDemoMode: () => void;
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    signOut: async () => { },
    loading: true,
    enterDemoMode: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Safe timeout to prevent infinite loading if Supabase hangs
        const timeout = setTimeout(() => {
            setLoading(false);
            console.warn("Auth check timed out - keeping loading=false to allow interaction");
        }, 3000);

        // Check for active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setSession(session);
                setUser(session.user);
            }
            setLoading(false);
            clearTimeout(timeout);
        }).catch((err) => {
            console.error("Auth initialization error:", err);
            setLoading(false);
            clearTimeout(timeout);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
            clearTimeout(timeout);
        };
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
    };

    const enterDemoMode = () => {
        const dummyUser = {
            id: 'demo-user',
            email: 'demo@nexus.com',
            user_metadata: { full_name: 'Usuario Demo' }
        } as unknown as User;

        const dummySession = {
            access_token: 'demo-token',
            user: dummyUser,
            refresh_token: 'demo-refresh',
            expires_in: 3600,
            token_type: 'bearer'
        } as unknown as Session;

        setSession(dummySession);
        setUser(dummyUser);
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{ session, user, signOut, loading, enterDemoMode }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
