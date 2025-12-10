"use client";

import { createClient } from "@/utils/supabase/client";
import { useState, useEffect, useContext, createContext, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";


interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signOut: () => Promise<void>;
    roles: Roles[];
}

interface Roles {
    restaurant_id: string;
    role: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState<Roles[]>([]);

    const supabase = createClient();

    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
            if (session?.user) fetchRoles(session.user.id);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
            if (session?.user) fetchRoles(session.user.id);
            else setRoles([{ restaurant_id: "", role: "user" }]);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase]);

    async function fetchRoles(userId: string) {
        const { data, error } = await supabase
            .from("restaurant_membership")
            .select("restaurant_id, role")
            .eq("user_id", userId);
            if (!error) setRoles(data);
    };

    async function signOut() {
        await supabase.auth.signOut();
        // Refresh the page after sign out
        window.location.href = '/';
    }

    const value = { user, session, loading, signOut, roles };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};

// Hook to use the auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}