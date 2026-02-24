"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";

interface User {
    _id: string;
    email?: string;
    emailAddress?: string;
    employeeId?: string;
    fullName?: string;
    role: "admin" | "employee";
    token: string;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const storedUser = localStorage.getItem("hrms_user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            axios.defaults.headers.common["Authorization"] = `Bearer ${parsed.token}`;
        } else {
            if (pathname !== "/login") {
                router.push("/login");
            }
        }
        setLoading(false);
    }, [pathname, router]);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem("hrms_user", JSON.stringify(userData));
        axios.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
        router.push(userData.role === "admin" ? "/" : "/attendance");
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("hrms_user");
        delete axios.defaults.headers.common["Authorization"];
        router.push("/login");
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', height: '100vh', width: '100vw', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-color)' }}>
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
