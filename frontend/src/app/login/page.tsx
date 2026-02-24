"use client";

import { useState } from "react";
import axios from "axios";
import { useAuth } from "@/components/AuthProvider";

const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth`;

export default function LoginPage() {
    const { login } = useAuth();
    const [activeTab, setActiveTab] = useState<"admin" | "employee">("admin");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        email: "",
        emailAddress: "",
        password: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const endpoint = activeTab === "admin" ? `${API_BASE}/admin/login` : `${API_BASE}/employee/login`;
            const payload = activeTab === "admin"
                ? { email: formData.email, password: formData.password }
                : { emailAddress: formData.emailAddress, password: formData.password };

            const res = await axios.post(endpoint, payload);

            if (res.data.success) {
                login(res.data.data);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Failed to authenticate");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100%', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', padding: '1rem' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, fontSize: '1.25rem' }}>
                        <div className="logo-icon" style={{ width: 40, height: 40 }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        </div>
                        HRMS Auth
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: '10px' }}>
                    <button
                        type="button"
                        onClick={() => { setActiveTab("admin"); setError(null); }}
                        style={{
                            flex: 1, padding: '0.6rem', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s',
                            background: activeTab === "admin" ? 'white' : 'transparent',
                            color: activeTab === "admin" ? 'var(--primary)' : '#64748b',
                            boxShadow: activeTab === "admin" ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                        }}
                    >
                        Admin Access
                    </button>
                    <button
                        type="button"
                        onClick={() => { setActiveTab("employee"); setError(null); }}
                        style={{
                            flex: 1, padding: '0.6rem', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s',
                            background: activeTab === "employee" ? 'white' : 'transparent',
                            color: activeTab === "employee" ? 'var(--primary)' : '#64748b',
                            boxShadow: activeTab === "employee" ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                        }}
                    >
                        Employee Portal
                    </button>
                </div>

                <form onSubmit={handleLogin}>
                    {error && <div className="form-group" style={{ color: "var(--danger)", backgroundColor: "var(--danger-light)", padding: "0.75rem", borderRadius: "8px", fontSize: "0.875rem", fontWeight: 500, textAlign: 'center' }}>{error}</div>}

                    {activeTab === "admin" ? (
                        <div className="form-group">
                            <label>Admin Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-control" required placeholder="admin@example.com" />
                        </div>
                    ) : (
                        <div className="form-group">
                            <label>Work Email</label>
                            <input type="email" name="emailAddress" value={formData.emailAddress} onChange={handleInputChange} className="form-control" required placeholder="employee@company.com" />
                        </div>
                    )}

                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="form-control" required placeholder="••••••••" />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }} disabled={loading}>
                        {loading ? "Authenticating..." : "Sign In Securely"}
                    </button>
                </form>
            </div>
        </div>
    );
}
